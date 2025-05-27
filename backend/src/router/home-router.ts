import express from "express";
import homeController from "../controller/home-controller";

const route = express.Router();

route.get("/api/home", homeController.index);

export default route;
