import express from 'express';
import Category from '../models/Category.js';

const router = express.Router();

const categories = [
  {
    id: '1',
    title: 'Sample Category 1',
    description: 'These categories are loaded by default if th server errors out',
  },
  {
    id: '2',
    title: 'Sample Category 2',
    description: 'This is the second category',
  },
];

export const getCategories = (req, res, next) => {
  console.log('getting categories');
  return Category.find({}).sort({ createdAt: -1 })
    .then((dbCategories) => {
      res.json(dbCategories);
    })
    .catch((error) => {
      res.status(404).json(categories);
    });
};

export const createCategory = ({ body }, res, next) => {
  Category.create(body)
    .then((dbCategory) => {
      res.json(dbCategory);
    })
    .catch((error) => {
      res.status(404).json(categories);
    });
};

export const getCategory = ({ params }, res, next) => {
  Category.findOne({ _id: params.id })
    .then((dbCategory) => {
      res.json(dbCategory);
    })
    .catch((error) => {
      res.status(404).json({ error: error.message });
    });
};

export const updateCategory = ({ params, body }, res, next) => {
  Category.findOneAndUpdate(
    { _id: params.id },
    { ...body },
    { new: true },
  )
    .then((dbCategory) => {
      res.json(dbCategory);
    })
    .catch((error) => {
      res.status(404).json({ error: error.message });
    });
};

export default router;
