import { z } from "zod";

export const participantJoinSchema = z.object({
    code: z.number().min(1, 'Quiz code is required')
});