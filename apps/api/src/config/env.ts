import dotenv from "dotenv";
import path from "path";
import { z } from "zod";

dotenv.config({
  path: path.resolve(process.cwd(), "../../.env"),
});

const EnvSchema = z.object({
  SERVER_PORT: z.string().default("8000").transform(Number),
  JWT_SECRET: z.string().min(1),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  CLIENT_APP_URL: z.string().optional(),
});

export const env = EnvSchema.parse(process.env);