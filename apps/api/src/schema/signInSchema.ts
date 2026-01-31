import { z } from "zod";

export const signInSchema = z.object({
    user: z.object({
        name: z.string().min(1),
        email: z.string().email("Invalid email format"),
        image: z.string().url().optional(),
    }),
    account: z.object({
        provider: z.literal("google"),
    }),
});