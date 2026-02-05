import { z } from "zod";

export enum QuestionTypeEnum{
    MCQ = "MCQ",
    TRUE_FALSE = "TRUE_FALSE",
};

export const questionSchema = z.object({
    questionText: z.string().min(1),
    type: z.nativeEnum(QuestionTypeEnum),
    options: z.array(z.string().min(1).max(4)),
    correct: z.number().int().nonnegative(),

    timeLimit: z.number().int().positive(),
    order: z.number().int().nonnegative(),
});

export const QuizSchema = z.object({
    title: z.string().min(1).max(128),
    description: z.string().optional(),
    questions: z.array(questionSchema).min(1),
});