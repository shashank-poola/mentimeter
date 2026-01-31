/*import { Router } from "express";
import authMiddleware from "@/middlewares/authMiddleware";
import upsertQuizController from "@/controllers/quiz-controller/upsertQuizController";
import getQuizController from "@/controllers/quiz-controller/getQuizController";
import getAllQuizController from "@/controllers/quiz-controller/getAllQuizController";
import deleteQuizController from "@/controllers/quiz-controller/deleteQuizController";
import publishQuizController from "@/controllers/quiz-controller/publishQuizController";

const router = Router();

router.post("/:quizId", authMiddleware, upsertQuizController);
router.get("/:quizId", authMiddleware, getQuizController);

router.get("/", authMiddleware, getAllQuizController);

router.delete("/:quizId", authMiddleware, deleteQuizController);
router.post("/:quizId/publish", authMiddleware, publishQuizController);

export default router;
*/