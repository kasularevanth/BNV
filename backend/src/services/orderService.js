const Order = require('../models/Order');
const Mockup = require('../models/Mockup');

const createOrder = async ({ mockupId, quantity, notes, clientId }) => {
  const mockup = await Mockup.findById(mockupId);
  if (!mockup) {
    const err = new Error('Mockup not found');
    err.statusCode = 404;
    throw err;
  }

  const totalPrice = mockup.price * quantity;

  return Order.create({
    clientId,
    mockupId,
    quantity,
    totalPrice,
    notes: notes || '',
  });
};

const getOrders = async (user, { status, page = 1, limit = 20 } = {}) => {
  const filter = {};

  if (user.role === 'client') {
    filter.clientId = user._id;
  } else if (user.role === 'designer') {
    // Designer sees orders for their mockups
    const mockupIds = await Mockup.find({ designerId: user._id }).distinct('_id');
    filter.mockupId = { $in: mockupIds };
  }

  if (status) filter.status = status;

  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('mockupId', 'name imageUrl price category')
      .populate('clientId', 'name email'),
    Order.countDocuments(filter),
  ]);

  return { orders, total, page, totalPages: Math.ceil(total / limit) };
};

const updateOrderStatus = async (orderId, designerId, status) => {
  const order = await Order.findById(orderId).populate('mockupId');
  if (!order) {
    const err = new Error('Order not found');
    err.statusCode = 404;
    throw err;
  }

  // Verify the designer owns the mockup
  if (order.mockupId.designerId.toString() !== designerId.toString()) {
    const err = new Error('Not authorized to update this order');
    err.statusCode = 403;
    throw err;
  }

  order.status = status;
  await order.save();
  return order;
};

const getDashboardStats = async (userId, role) => {
  if (role === 'designer') {
    const mockupIds = await Mockup.find({ designerId: userId }).distinct('_id');
    const totalMockups = await Mockup.countDocuments({ designerId: userId });

    const [ordersReceived, pendingOrders, completedOrders] = await Promise.all([
      Order.countDocuments({ mockupId: { $in: mockupIds } }),
      Order.countDocuments({ mockupId: { $in: mockupIds }, status: 'pending' }),
      Order.countDocuments({ mockupId: { $in: mockupIds }, status: 'completed' }),
    ]);

    const successRate = ordersReceived > 0
      ? Math.round((completedOrders / ordersReceived) * 100)
      : 0;

    return { totalMockups, ordersReceived, pendingOrders, completedOrders, successRate };
  }

  // Client stats
  const [totalOrders, pendingOrders, completedOrders] = await Promise.all([
    Order.countDocuments({ clientId: userId }),
    Order.countDocuments({ clientId: userId, status: 'pending' }),
    Order.countDocuments({ clientId: userId, status: 'completed' }),
  ]);

  return { totalOrders, pendingOrders, completedOrders };
};

module.exports = { createOrder, getOrders, updateOrderStatus, getDashboardStats };
