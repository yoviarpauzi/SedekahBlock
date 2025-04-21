import dotenv from "dotenv";

dotenv.config();

export const port = process.env.APP_PORT;
export const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
export const feURI = process.env.FE_URI;
