import { Router } from 'express';
import mongoose from 'mongoose';
import Recipe from '../models/Recipe.js';

const router = Router();

function validateRecipe(body) {
  const { name, category, ingredients, steps, cookingTime } = body;
  if (![name, category, ingredients, steps].every(v => typeof v === 'string' && v.trim())) {
    return 'Please fill in all fields.';
  }
  const time = Number(cookingTime);
  if (!Number.isInteger(time) || time < 1 || time > 1440) {
    return 'Cooking time must be a whole number between 1 and 1440 minutes.';
  }
  return null;
}

router.get('/', async (_req, res) => {
  try {
    res.json(await Recipe.find().sort({ createdAt: -1 }));
  } catch {
    res.status(500).json({ message: 'Could not load recipes.' });
  }
});

router.get('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid recipe ID.' });
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found.' });
    res.json(recipe);
  } catch {
    res.status(500).json({ message: 'Could not load recipe.' });
  }
});

router.post('/', async (req, res) => {
  const error = validateRecipe(req.body);
  if (error) return res.status(400).json({ message: error });
  try {
    const recipe = await Recipe.create({
      name: req.body.name.trim(), category: req.body.category.trim(),
      ingredients: req.body.ingredients.trim(), steps: req.body.steps.trim(),
      cookingTime: Number(req.body.cookingTime)
    });
    res.status(201).json(recipe);
  } catch {
    res.status(500).json({ message: 'Could not save recipe.' });
  }
});

router.put('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid recipe ID.' });
  const error = validateRecipe(req.body);
  if (error) return res.status(400).json({ message: error });
  try {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, {
      name: req.body.name.trim(), category: req.body.category.trim(),
      ingredients: req.body.ingredients.trim(), steps: req.body.steps.trim(),
      cookingTime: Number(req.body.cookingTime)
    }, { new: true, runValidators: true });
    if (!recipe) return res.status(404).json({ message: 'Recipe not found.' });
    res.json(recipe);
  } catch {
    res.status(500).json({ message: 'Could not update recipe.' });
  }
});

router.delete('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid recipe ID.' });
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found.' });
    res.json({ message: 'Recipe deleted successfully.' });
  } catch {
    res.status(500).json({ message: 'Could not delete recipe.' });
  }
});

export default router;
