const mockupService = require('../services/mockupService');

const getMockups = async (req, res, next) => {
  try {
    const { category, sort, search, page, limit } = req.query;
    const result = await mockupService.getMockups({ category, sort, search, page, limit });
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

const getMyMockups = async (req, res, next) => {
  try {
    const { category, sort } = req.query;
    const mockups = await mockupService.getDesignerMockups(req.user._id, { category, sort });
    res.json({ success: true, mockups });
  } catch (error) {
    next(error);
  }
};

const getMockupById = async (req, res, next) => {
  try {
    const mockup = await mockupService.getMockupById(req.params.id);
    res.json({ success: true, mockup });
  } catch (error) {
    next(error);
  }
};

const createMockup = async (req, res, next) => {
  try {
    const { name, description, price, category, tags, badge } = req.body;
    const mockup = await mockupService.createMockup({
      name,
      description,
      price,
      category,
      tags,
      badge,
      designerId: req.user._id,
      file: req.file,
    });
    res.status(201).json({ success: true, mockup });
  } catch (error) {
    next(error);
  }
};

const updateMockup = async (req, res, next) => {
  try {
    const mockup = await mockupService.updateMockup(
      req.params.id,
      req.user._id,
      req.body,
      req.file
    );
    res.json({ success: true, mockup });
  } catch (error) {
    next(error);
  }
};

const deleteMockup = async (req, res, next) => {
  try {
    await mockupService.deleteMockup(req.params.id, req.user._id);
    res.json({ success: true, message: 'Mockup deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMockups, getMyMockups, getMockupById, createMockup, updateMockup, deleteMockup };
