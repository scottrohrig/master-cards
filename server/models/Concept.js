import { Schema, model } from 'mongoose';

const ConceptSchema = new Schema(
  {
    concept: {
      type: String,
      required: true,

    },
    definition: {
      type: String,

    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
  },
  { timestamps: true }
);

const Concept = model('Concept', ConceptSchema);

export default Concept;
