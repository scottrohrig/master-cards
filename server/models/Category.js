import { Schema, model } from 'mongoose';

const CategorySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      min: 3,
      max: 100,
    },
    description: {
      type: String,
      max: 250,
    }
  },
  { timestamps: true}
)

const Category = model('Category', CategorySchema);

export default Category;
