import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import { feOrigin } from "../utils/environment";
import path from "path";

const corsOptions: CorsOptions = {
  origin: feOrigin,
  credentials: true,
  optionsSuccessStatus: 200,
};

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(cors(corsOptions));
app.use(
  express.static(path.resolve(__dirname, "./../storage/"), {
    fallthrough: true,
  }),
  express.static(path.resolve(__dirname, "./../temp/"), {
    fallthrough: true,
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

export { app, io };
