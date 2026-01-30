import type { Request, Response } from "express";
import { db } from "@repo/database";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export default async function signInController(req: Request, res: Response) {
  const { user, account } = req.body;

  try {
    const provider = account?.provider;

    const exisitingUser = await db.user.findUnique({
      where: { email: user.email },
    });

    let myUser;

    if (exisitingUser) {
      const updateData = {
        name: user.name,
        email: user.email,
        image: user.image,
      };

      myUser = await db.user.update({
        where: { email: user.email },
        data: updateData,
      });
    } else {
      myUser = await db.user.create({
        data: {
          name: user.name,
          email: user.email,
          image: user.image,
        },
      });
    }

    if (!JWT_SECRET) {
      res.status(500).json({ message: "server error" });
      return;
    }

    const jwtPayload = {
      name: myUser.name,
      email: myUser.email,
      id: myUser.id,
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

