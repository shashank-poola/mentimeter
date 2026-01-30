import type { Request, Response } from "express";
import { db } from "@repo/database";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export default async function signInController(req: Request, res: Response) {
  const { user, account } = req.body;

  if (!user || !account) {
    return res.status(400).json({
      success: false,
      message: "Invalid auth payload",
    });
  }

  try {
    const provider = account?.provider;

    if(provider !== "google") {
      res.status(401).json({ 
        success: false,
        message: "Invalid auth provider"
      });
    }

    const exisitingUser = await db.user.findUnique({
      where: { email: user.email },
    });

    let myUser;

    if (exisitingUser) {
      myUser = exisitingUser
    } else {
      myUser = await db.user.create({
        data: {
          name: user.name,
          email: user.email,
          image: user.image,
          role: "ADMIN",
        },
      });
    }

    if (!JWT_SECRET) {
      res.status(500).json({ message: "JWT secret not configured" });
      return;
    }

    const jwtPayload = {
      id: myUser.id,
      name: myUser.name,
      email: myUser.email,
      role: myUser.role,
      provider,
    };

    const token = jwt.sign(jwtPayload, JWT_SECRET);

    res.json({
      success: true,
      user: {
        ...myUser,
      },
      token: token,
    });
    return;
  } catch (err) {
    console.error("Authentication error", err);
    res.status(500).json({
      success: false,
      error: "Authentication failed",
    });
  }
}

