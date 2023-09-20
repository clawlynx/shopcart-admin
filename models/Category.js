import mongoose, { Schema, model, models } from "mongoose";

const PropertySchema = new Schema({
  name: String,
  values: [String],
});

const CategorySchema = new Schema({
  categoryName: { type: String, required: true },
  parentCategory: {
    type: mongoose.Types.ObjectId,
    ref: "Category",
    required: false,
  },
  property: [PropertySchema],
  ownerEmail: String,
});

export const Category = models.Category || model("Category", CategorySchema);
