import type { NextFunction, Request, Response } from 'express';
import { env } from '../configs/env';
import jwt from 'jsonwebtoken';

const verifyJwt = (token: string) => {
    const secret = env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is not defined");
    }

    try {
        const decoded = jwt.verify(token, secret);
        return decoded;
    } catch (error) {
        return null;
    }
}

export const authMiddleware = async ( req: Request, res: Response, next: NextFunction ) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        res.status(404).json({
            "success": false,
            "data": null,
            "error": "UNAUTHORIZED"
        })
        return;
    }

    const decoded = verifyJwt(token) as { id: string; role: string } | null;
    if (!decoded) {
        res.status(400).json({
            "success": false,
            "data": null,
            "error": "UNAUTHORIZED"
        })
        return;
    };

    next();
};