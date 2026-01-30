import { Router } from "express";
import authRouter from "./auth-route/authRoute";

const mainRouter = Router();

mainRouter.use("/auth", authRouter);

export default mainRouter;