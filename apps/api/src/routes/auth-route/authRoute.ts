import { Router } from "express";
import signInController from "../../controller/user-controller/signInController";
import { authMiddleware } from "../../middleware/authMiddleware";
import { checkController } from "../../controller/user-controller/checkController";

const authRouter = Router();

authRouter.post("/signin", signInController);

authRouter.get("/health", checkController);

export default authRouter;