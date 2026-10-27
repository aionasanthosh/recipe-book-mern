import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  category: { type: String, required: true, trim: true },
  ingredients: { type: String, required: true, trim: true },
  steps: { type: String, required: true, trim: true },
  cookingTime: { type: Number, required: true, min: 1, max: 1440 }
}, { timestamps: true });

export default mongoose.model('Recipe', recipeSchema);
