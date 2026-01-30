import type { Request, Response } from "express";

export const checkController = async(req: Request, res: Response) => {
    res.status(200).json({ 
        success: true,
        message: "Server is running smoothly",
        timestamp: new Date().toISOString(),
    })
}