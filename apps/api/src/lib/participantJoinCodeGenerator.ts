import { db } from "@repo/database";
import { customAlphabet } from "nanoid";
import jwt from "jsonwebtoken";
import { SessionTokenPayload, SESSION_ROLE } from "../types";

const JWT_SECRET = process.env.JWT_SECRET!;

export class QuizAction {
  private static generateNumericCode = customAlphabet("0123456789", 8);

  static async generateUniqueJoinCode(): Promise<string> {
    let attempts = 0;
    const MAX_ATTEMPTS = 10;

    while (attempts < MAX_ATTEMPTS) {
      const code = QuizAction.generateNumericCode();
      const exists = await db.quiz.findUnique({
        where: { joinCode: code },
        select: { id: true },
      });
      if (!exists) return code;
      attempts++;
    }

    throw new Error("Failed to generate unique join code after maximum attempts");
  }

  static generateTokenId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  static generateSessionToken(payload: {
    userId?: string;
    sessionId: string;
    quizId: string;
    role: SESSION_ROLE;
    participantId?: string;
  }): string {
    const tokenId = QuizAction.generateTokenId();
    const now = Math.floor(Date.now() / 1000);

    const fullPayload: SessionTokenPayload = {
      ...payload,
      tokenId,
      iat: now,
      exp: now + 24 * 60 * 60,
    };

    return jwt.sign(fullPayload, JWT_SECRET);
  }

  static verifySessionToken(token: string): SessionTokenPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as SessionTokenPayload;
    } catch {
      return null;
    }
  }

  static async validateQuizOwnership(
    userId: string,
    quizId: string
  ): Promise<boolean> {
    const quiz = await db.quiz.findUnique({
      where: { id: quizId, hostId: userId },
      select: { id: true },
    });
    return !!quiz;
  }

  static async validateSessionAccess(
    sessionId: string,
    userId?: string,
    participantId?: string
  ): Promise<boolean> {
    const session = await db.gameSession.findUnique({
      where: { id: sessionId },
      include: {
        quiz: { select: { hostId: true } },
        participants: participantId
          ? { where: { id: participantId }, select: { id: true } }
          : false,
      },
    });

    if (!session) return false;

    if (userId && session.quiz.hostId === userId) return true;
    if (participantId && session.participants && session.participants.length > 0)
      return true;

    return false;
  }

  static async getSessionByJoinCode(joinCode: string) {
    return await db.quiz.findUnique({
      where: { joinCode },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        sessions: {
          where: { status: { in: ["WAITING", "LIVE"] } },
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            id: true,
            status: true,
            startedAt: true,
            _count: { select: { participants: true } },
          },
        },
      },
    });
  }

  static sanitizeSessionData(session: any, role: SESSION_ROLE) {
    if (role === "ADMIN") {
      return session;
    }

    const { quiz, ...rest } = session;
    return {
      ...rest,
      quiz: quiz
        ? {
            id: quiz.id,
            title: quiz.title,
            description: quiz.description,
          }
        : undefined,
    };
  }

  static async deleteQuiz(quizId: string, userId: string): Promise<boolean> {
    const isOwner = await QuizAction.validateQuizOwnership(userId, quizId);
    if (!isOwner) return false;

    await db.quiz.delete({ where: { id: quizId } });
    return true;
  }

  static createJoinUrl(joinCode: string): string {
    return `http://localhost:8000/join/${joinCode}`;
  }

  static isTokenExpired(payload: SessionTokenPayload): boolean {
    return payload.exp < Math.floor(Date.now() / 1000);
  }

  static async validateParticipantNickname(
    sessionId: string,
    nickname: string
  ): Promise<boolean> {
    const existing = await db.participant.findUnique({
      where: {
        sessionId_nickname: {
          sessionId,
          nickname,
        },
      },
      select: { id: true },
    });
    return !existing;
  }
}