import express from 'express';

const router = express.Router();

const concepts = [
  {
    id: '1',
    concept: 'Concept 1',
    definition: 'This is the first concept',
    categoryId: '1',
  },
  {
    id: '2',
    concept: 'Concept 2',
    definition: 'This is the second concept',
    categoryId: '2',
  },
];

router.get('/', (req, res) => {
  res.send(concepts);
});

router.post('/', (req, res) => {
  const concept = req.body;
  concepts.push(concept);
  res.send(`Concept with the title ${concept.title} added to the database!`);
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const concept = concepts.find((concept) => concept.id === id);
  res.send(concept);
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const concept = concepts.find((concept) => concept.id === id);
  if (title) concept.title = title;
  if (description) concept.description = description;
  res.send(`Concept with the id ${id} has been updated`);
});

export default router;
