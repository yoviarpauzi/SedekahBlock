import { Request, Response, NextFunction } from "express";
import ResponseError from "../error/response-error";
import jwt from "jsonwebtoken";
import { accessTokenSecret } from "../utils/environment";
import userService from "../services/user-service";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = await req.cookies.accessToken;

  if (!accessToken) {
    throw new ResponseError(401, "access token not found");
  }

  try {
    const decodedToken = jwt.verify(
      accessToken,
      accessTokenSecret!
    ) as jwt.JwtPayload;

    const user = await userService.getUserById(decodedToken.id);

    if (!user) {
      throw new ResponseError(404, "user not found");
    }

    next();
  } catch (err: any) {
    res.clearCookie("accessToken");
    throw new ResponseError(401, err.message || "Invalid token");
  }
};

export default authMiddleware;
