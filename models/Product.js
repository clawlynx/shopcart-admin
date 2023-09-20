const { Schema, model, default: mongoose } = require("mongoose");

const ImageSchema = new Schema({
  fileUrl: String,
  fileKey: String,
});

const ProductSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    price: {
      type: Number,
      required: true,
    },
    images: [ImageSchema],
    category: { type: mongoose.Types.ObjectId, ref: "Category" },
    property: Object,
    ownerEmail: String,
  },
  {
    timestamps: true,
  }
);

export const Product =
  mongoose.models.Product || model("Product", ProductSchema);
