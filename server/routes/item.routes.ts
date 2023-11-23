import express from "express";
const router = express.Router();
import {
  createItem,
  updateItem,
  deleteItem,
  getItems,
} from "../controllers/item.controllers";
import { requireLogin } from "../middlewares/auth.middlewares";

router
  .get("/", getItems)
  .post("/", requireLogin, createItem)
  .put("/:id", requireLogin, updateItem)
  .delete("/:id", requireLogin, deleteItem);

export default router;
