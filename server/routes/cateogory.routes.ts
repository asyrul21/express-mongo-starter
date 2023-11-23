import express from "express";
const router = express.Router();
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
} from "../controllers/category.controllers";
import { mustBeAdmin, requireLogin } from "../middlewares/auth.middlewares";

router
  .get("/", getCategories)
  .post("/", requireLogin, mustBeAdmin, createCategory)
  .put("/:id", requireLogin, mustBeAdmin, updateCategory)
  .delete("/:id", requireLogin, mustBeAdmin, deleteCategory);

export default router;
