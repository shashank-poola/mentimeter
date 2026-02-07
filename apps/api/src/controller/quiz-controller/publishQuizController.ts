import type { Request, Response } from "express";
import { QuizSchema } from "../../schema/quizSchema";
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

        const { title, description, questions } = parsed.data;

        const quiz = await db.$transaction(async (tx) => {
            return tx.quiz.create({
                data: {
                    title,
                    description,
                    hostId: user.id,

                    questions: {
                        create: questions.map((questions, index) => {
                            if (questions.correct >= questions.options.length) {
                                throw new Error("Invalid correct option index");
                            }

                            return {
                                text: questions.questionText,
                                type: questions.type,
                                options: questions.options,
                                correct: questions.correct,
                                timeLimit: questions.timeLimit,
                                order: index,
                            };
                        }),
                    },
                },
                select: {
                    id: true,
                    title: true,
                    status: true,
                    createdAt: true,
                    _count: {
                        select: {
                            questions: true
                        },
                    },
                },
            });
        });

        return res.status(201).json({
            "success": false,
            "data": quiz,
            "error": null
        });

    } catch (error) {
        res.status(500).json({
            "success": false,
            "data": null,
            "error": "INTERNAL_sERVER_ERROR"
        })
        return;
    }
}