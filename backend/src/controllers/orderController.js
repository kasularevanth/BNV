const orderService = require('../services/orderService');

const createOrder = async (req, res, next) => {
  try {
    const { mockupId, quantity, notes } = req.body;
    const order = await orderService.createOrder({
      mockupId,
      quantity,
      notes,
      clientId: req.user._id,
    });
    const populated = await order.populate([
      { path: 'mockupId', select: 'name imageUrl price category' },
      { path: 'clientId', select: 'name email' },
    ]);
    res.status(201).json({ success: true, order: populated });
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const { status, page, limit } = req.query;
    const result = await orderService.getOrders(req.user, { status, page, limit });
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await orderService.updateOrderStatus(
      req.params.id,
      req.user._id,
      req.body.status
    );
    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getOrders, updateOrderStatus };
