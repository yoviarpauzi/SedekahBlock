import { NextFunction, Request, Response } from "express";
import userService from "../services/user-service";
import path from "path";
import fs from "fs/promises";

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
    const query = req.query;
    query.page = query.page ?? "1";

    const [users, rowCount] = await userService.getAllUser(query);

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
    let file = req.file?.filename;
    const id = Number(req.params.id);
    const user = await userService.getUserById(id);

    if (file) {
        file = `users/${file}`;
        const oldProfilePath = path.resolve(
          __dirname,
          `../storage/${user?.profile_picture}`
        );

        try {
          await fs.unlink(oldProfilePath);
        } catch (err) {
          console.error("Error deleting old profile picture:", err);
        }
    } else {
      file = user?.profile_picture;
    }

    if (!req.body.name) {
      req.body.name = user?.name;
    }

    await userService.update(id, req.body.name, file!);

    res.status(200).json({
      message: "success update user data",
    });
  } catch (err) {
    next(err);
  }
};

export default {
  getProfile,
  getUser,
  getUsers,
  update,
};
