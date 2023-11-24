import { NextFunction, Request, Response } from "express";
import CategoryModel, { CategoryDocument } from "../models/Category.model";
import { catchControllerError } from "../utils/error";
import { HydratedDocument } from "mongoose";
import { validateRequestBody } from "../utils/validateRequestBody";
import { CreateCategoryDto } from "./dtos/Create-Category.dto";
import { UpdateCategoryDto } from "./dtos/Update-Category.dto";

export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await CategoryModel.find();
    return res.status(200).json(categories);
  } catch (error) {
    catchControllerError({
      operation: "getCategories",
      statusCode: 400,
      error: error,
      response: res,
      errorMessagePrefix: "Get categories failed",
      next,
    });
  }
};

export const createCategory = async (
  req: Request<object, unknown, CategoryDocument>,
  res: Response,
  next: NextFunction
) => {
  try {
    const CreateCategoryData = await validateRequestBody<CategoryDocument>(
      CreateCategoryDto,
      req.body
    );
    const { name, description } = CreateCategoryData;
    if (!name) {
      throw new Error("Require request body parameter [name]");
    }
    const foundCategory: HydratedDocument<CategoryDocument> =
      await CategoryModel.findOne({
        name: name.toLocaleLowerCase(),
      });

    if (foundCategory) {
      throw new Error(`Category ${foundCategory.name} already exist`);
    }

    const CreatedCateogry: HydratedDocument<CategoryDocument> =
      new CategoryModel({
        name,
        description,
      });

    await CreatedCateogry.save();
    const categories = await CategoryModel.find();
    return res.status(201).json(categories);
  } catch (error) {
    catchControllerError({
      operation: "createCategory",
      statusCode: 400,
      error: error,
      response: res,
      errorMessagePrefix: "Create category failed",
      next,
    });
  }
};

export const updateCategory = async (
  req: Request<{ id: string }, unknown, CategoryDocument>,
  res: Response,
  next: NextFunction
) => {
  const categoryId = req.params.id;
  try {
    const UpdateCategoryData = await validateRequestBody<CategoryDocument>(
      UpdateCategoryDto,
      req.body
    );
    const { name } = UpdateCategoryData;

    if (typeof name === "string") {
      // user tries to change the name
      const foundCategory: HydratedDocument<CategoryDocument> =
        await CategoryModel.findOne({
          name: { $regex: new RegExp(name, "i") },
        });

      if (foundCategory) {
        throw new Error(
          `Category with name ${foundCategory.name} already exist`
        );
      }
    }

    const foundCategory: HydratedDocument<CategoryDocument> =
      await CategoryModel.findById(categoryId);

    if (!foundCategory) {
      throw new Error("Category not found");
    }

    Object.keys(req.body).forEach((p) => {
      foundCategory[p] = req.body[p];
    });

    await foundCategory.save();
    const categories = await CategoryModel.find();
    return res.status(200).json(categories);
  } catch (error) {
    catchControllerError({
      operation: "updateCategory",
      statusCode: 400,
      error: error,
      response: res,
      errorMessagePrefix: "Update category failed",
      next,
    });
  }
};

export const deleteCategory = async (
  req: Request<{ id?: string }, unknown, CategoryDocument>,
  res: Response,
  next: NextFunction
) => {
  const categoryId: null | string = req.params.id;
  try {
    if (typeof categoryId !== "string") {
      throw new Error("Require request parameter field [id]");
    }

    const foundCategory: HydratedDocument<CategoryDocument> =
      await CategoryModel.findById(categoryId);
    if (!foundCategory) {
      throw new Error("Category not found");
    }
    await foundCategory.deleteOne();
    const categories = await CategoryModel.find();
    return res.status(200).json(categories);
  } catch (error) {
    catchControllerError({
      operation: "deleteCategory",
      statusCode: 400,
      error: error,
      response: res,
      errorMessagePrefix: "Delete category failed",
      next,
    });
  }
};
