import { SESSION_ROLE } from "./database.types";

export interface SessionTokenPayload {
  userId?: string;
  sessionId: string;
  quizId: string;
  role: SESSION_ROLE;
  participantId?: string;
  tokenId: string;
  iat: number;
  exp: number;
}