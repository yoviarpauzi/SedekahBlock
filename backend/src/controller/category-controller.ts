import { NextFunction, Request, Response } from "express";
import categoryValidation from "../validations/category-validation";
import categoryService from "../services/category-service";

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validate = await categoryValidation.create.parseAsync(req.body);

    const category = await categoryService.create(validate.name);

    res.status(200).json({
      message: "success create category",
      data: {
        ...category,
      },
    });
  } catch (err) {
    next(err);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validate = await categoryValidation.update.parseAsync(req.body);
    const category = await categoryService.update(validate.id, validate.name);

    res.status(200).json({
      message: "success update category",
      data: {
        ...category,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getAllCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const [categories, rowCount] = await categoryService.getAllCategory();

    res.status(200).json({
      message: "success retrieve categories",
      data: {
        categories,
        rowCount,
      },
    });
  } catch (err) {
    next(err);
  }
};

const isNameExist = async (req: Request, res: Response, next: NextFunction) => {
  const name: string = req.query?.name?.toString() ?? "";

  const isNameExist = await categoryService.isCategoryNameExist(name);

  res.status(200).json({
    message: "success check category",
    data: isNameExist,
  });
};

const destroy = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id: number = parseInt(req.params.id);

    const category = await categoryService.destroy(id);

    res.status(204).json({
      message: "success delete category",
    });
  } catch (err) {
    next(err);
  }
};

export default {
  create,
  update,
  getAllCategory,
  isNameExist,
  destroy,
};
