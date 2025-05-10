import { NextFunction, Request, Response } from "express";
import userService from "../services/user-service";
import userValidation from "../validations/user-validation";

const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const wallet = req.params.wallet;

    const user = await userService.getUserByWallet(wallet);

    res.status(200).json({
      message: "success retrieve user profile",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const user = await userService.getUserById(Number(id));

    res.status(200).json({
      message: "success retrieve user data",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const search = req.query.search?.toString() ?? "";
    const page = Number(req.query.page) || 1;

    const [users, rowCount] = await userService.getAllUser(page, search);

    res.status(200).json({
      message: "successfully retrieved user data",
      data: {
        users: users,
        rowCount: rowCount,
      },
    });
  } catch (err) {
    next(err);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const validate = userValidation.update.parse(req.body);

    const user = await userService.update(Number(id), validate.name);

    res.status(200).json({
      message: "success update user data",
      data: {
        ...user,
      },
    });
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req: Request, res: Response) => {
  const id = req.params.id;
  const validate = userValidation;
};

export default {
  getProfile,
  getUser,
  getUsers,
  update,
  updateProfile,
};
