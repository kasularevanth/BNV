const Mockup = require('../models/Mockup');
const cloudinary = require('../config/cloudinary');

const SORT_MAP = {
  'Recently Edited': { updatedAt: -1 },
  'Newest First': { createdAt: -1 },
  'Price: Low to High': { price: 1 },
  'Price: High to Low': { price: -1 },
};

const getMockups = async ({ category, sort, search, page = 1, limit = 20 }) => {
  const filter = {};
  if (category && category !== 'All assets') filter.category = category;
  if (search) filter.$text = { $search: search };

  const sortOption = SORT_MAP[sort] || { createdAt: -1 };
  const skip = (page - 1) * limit;

  const [mockups, total] = await Promise.all([
    Mockup.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .populate('designerId', 'name email'),
    Mockup.countDocuments(filter),
  ]);

  return { mockups, total, page, totalPages: Math.ceil(total / limit) };
};

const getDesignerMockups = async (designerId, { category, sort } = {}) => {
  const filter = { designerId };
  if (category && category !== 'All assets') filter.category = category;
  const sortOption = SORT_MAP[sort] || { createdAt: -1 };
  return Mockup.find(filter).sort(sortOption);
};

const getMockupById = async (id) => {
  const mockup = await Mockup.findById(id).populate('designerId', 'name email');
  if (!mockup) {
    const err = new Error('Mockup not found');
    err.statusCode = 404;
    throw err;
  }
  return mockup;
};

const createMockup = async ({ name, description, price, category, tags, badge, designerId, file }) => {
  if (!file) {
    const err = new Error('Image file is required');
    err.statusCode = 400;
    throw err;
  }

  return Mockup.create({
    name,
    description,
    price: parseFloat(price),
    category,
    tags: tags ? (Array.isArray(tags) ? tags : [tags]) : [],
    badge: badge || null,
    imageUrl: file.path,
    publicId: file.filename,
    designerId,
  });
};

const updateMockup = async (id, designerId, updateData, file) => {
  const mockup = await Mockup.findById(id);
  if (!mockup) {
    const err = new Error('Mockup not found');
    err.statusCode = 404;
    throw err;
  }
  if (mockup.designerId.toString() !== designerId.toString()) {
    const err = new Error('Not authorized to edit this mockup');
    err.statusCode = 403;
    throw err;
  }

  if (file) {
    // Delete old image from Cloudinary
    await cloudinary.uploader.destroy(mockup.publicId);
    updateData.imageUrl = file.path;
    updateData.publicId = file.filename;
  }

  if (updateData.price !== undefined) updateData.price = parseFloat(updateData.price);

  return Mockup.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

const deleteMockup = async (id, designerId) => {
  const mockup = await Mockup.findById(id);
  if (!mockup) {
    const err = new Error('Mockup not found');
    err.statusCode = 404;
    throw err;
  }
  if (mockup.designerId.toString() !== designerId.toString()) {
    const err = new Error('Not authorized to delete this mockup');
    err.statusCode = 403;
    throw err;
  }

  await cloudinary.uploader.destroy(mockup.publicId);
  await mockup.deleteOne();
};

module.exports = { getMockups, getDesignerMockups, getMockupById, createMockup, updateMockup, deleteMockup };
