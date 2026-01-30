import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = async(req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.header.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(404).json
        ({ message: "Unauthorized: No token provided"})
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET;

    if (!token) {
        res.status(500).json({ message: "Token is not avaiable"})
    }

    if (!secret) {
        res.status(500).json({ message: "JWT Secret is not configure"})
    }

    try {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                res.status(401).json({ message: "Not authorized"})
                return;
            }
            req.User = decoded as AuthUser;
            next();
        });
    } catch(err) {
        res.status(500).json({ message: "Internal Server Error" })
        return;
    }
}
