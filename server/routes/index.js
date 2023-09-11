import express from 'express';
import conceptsController from '../controllers/concepts.js';
import categoriesController from '../controllers/categories.js';
import categoryRoutes from './category.js';

const router = express.Router();

// Import the controllers


// GET Route for retrieving all the
router.get('/', (req, res) => {
  // YOUR CODE HERE
  res.send({ message: 'Hello, world!' });
});

router.get('/api/user/:id', (req, res) => {
  res.json({
      id: req.params.id,
      name: 'Jogn',
      surname: 'Doe',
      email: 'jgndo@dogn.co',
  });
});

router.use('/api/categories', categoryRoutes);
router.use('/api/concepts', conceptsController);


export default router;
