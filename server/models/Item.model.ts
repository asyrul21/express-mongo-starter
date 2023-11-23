import { Document, Schema, model } from "mongoose";
import { CategoryDocument } from "./Category.model";
import { UserDocument } from "./User.model";

export type ItemDocument = Document & {
  name: string;
  description?: string;
  user?: UserDocument;
  categories?: CategoryDocument[];
};

const ItemSchema = new Schema<ItemDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const ItemModel = model<ItemDocument>("Item", ItemSchema);
export default ItemModel;
