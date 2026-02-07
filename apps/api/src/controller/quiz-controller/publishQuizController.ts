import type { Request, Response } from "express";
import { questionSchema, QuizSchema } from "../../schema/quizSchema";
import { db } from "@repo/database";

export const publishQuiz = async ( req: Request, res: Response ) => {
    try {
        const user = req.user;

        if (!user) {
            res.status(401).json({
                "success": false,
                "data": null,
                "error": "UNAUTHORIZED",
            })
            return;
        }

        if (user.role !== "ADMIN" ) {
            res.status(403).json({
                "success": false,
                "data": null,
                "error": "FORBIDDEN"
            })
            return;
        }

        const parsed = QuizSchema.safeParse(req.body);

        if (!parsed.success) {
            res.status(400).json({
                "success": false,
                "data": null,
                "error": "INVALID_REQUEST"
            })
            return;
        }


    } catch (error) {
        res.status(500).json({
            "success": false,
            "data": null,
            "error": "INTERNAL_sERVER_ERROR"
        })
        return;
    }
}