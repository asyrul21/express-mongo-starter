import { Document, Schema, model } from "mongoose";

export type CategoryDocument = Document & {
  name: string;
  description?: string;
};

const CategorySchema = new Schema<CategoryDocument>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const CategoryModel = model<CategoryDocument>("Category", CategorySchema);
export default CategoryModel;
