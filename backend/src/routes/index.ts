import express from "express";
import { authRoute } from "./auth";
import { usersRoute } from "./users";
import { gymsRoute } from "./gyms";

export const routes = express.Router();
routes.use(authRoute);
routes.use(usersRoute);
routes.use(gymsRoute);
