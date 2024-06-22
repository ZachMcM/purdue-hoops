import { NextFunction, Router, Request, Response } from "express";
import bycrpt from "bcrypt";
import { createSession } from "../utils/createSession";
import jwt from "jsonwebtoken";
import { TokenPayload } from "../types";
import prisma from "../prismaClient";
export const authRoute = Router();

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log("Authenticating...");
  const accessToken = req.header("Access-Token");

  if (!accessToken) {
    return res
      .status(400)
      .json({ error: "Invalid request, no tokens provided." });
  }

  try {
    const decodedAccess = jwt.verify(
      accessToken,
      process.env.JWT_SECRET!,
    ) as TokenPayload;
    res.locals.userId = decodedAccess.userId;
    next();
  } catch (err) {
    console.log("Invalid access token. Unauthorized.");
    return res
      .status(401)
      .json({ error: "Invalid access token. Unauthorized." });
  }
};

authRoute.get("/auth/session", authMiddleware, async (req, res) => {
  const userId = res.locals.userId;
  console.log(userId);

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      incomingRatings: true,
      outgoingRatings: true,
      hoopSessions: true,
      incomingSearches: {
        select: {
          id: true,
          name: true,
          image: true,
          incomingRatings: true,
          position: true,
          primarySkill: true,
          secondarySkill: true,
          overallRating: true,
        },
      },
      outgoingSearches: {
        select: {
          id: true,
          name: true,
          image: true,
          incomingRatings: true,
          position: true,
          primarySkill: true,
          secondarySkill: true,
          overallRating: true,
        },
      },
      outgoingFriendships: true,
      incomingFriendships: true
    },
  });

  if (!user) {
    return res.status(404).json({ error: "Error, no user found." });
  }

  const protectedUser = { ...user, password: undefined };

  return res.json({
    user: protectedUser,
    userId: userId,
  });
});

authRoute.post("/auth/signup", async (req, res) => {
  console.log(req.body);
  const {
    name,
    username,
    email,
    password,
    feet,
    inches,
    weight,
    position,
    primarySkill,
    secondarySkill,
  } = req.body as {
    name?: string;
    username?: string;
    email?: string;
    password?: string;
    feet?: number;
    inches?: number;
    weight?: number;
    position?: string;
    primarySkill?: string;
    secondarySkill?: string;
  };

  if (
    !name ||
    !username ||
    !email ||
    !password ||
    !feet ||
    !inches ||
    !weight ||
    !position ||
    !primarySkill ||
    !secondarySkill
  ) {
    return res.status(400).json({ error: "Invalid request, invalid payload" });
  }

  if (!email.endsWith("@purdue.edu")) {
    return res
      .status(400)
      .json({ error: "Invalid request, must have purdue.edu email." });
  }

  const sameEmail = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (sameEmail) {
    return res
      .status(400)
      .json({ error: "Error, a user with this email already exists." });
  }

  const sameUsername = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  if (sameUsername) {
    console.log("Invalid request, same username already exists.");
    return res
      .status(400)
      .json({ error: "Error, a user with this username already exists." });
  }

  const encryptedPassword = await bycrpt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      username,
      email,
      password: encryptedPassword,
      feet,
      inches,
      weight,
      position,
      primarySkill,
      secondarySkill,
    },
  });

  const accessToken = await createSession(user);

  return res.header("Access-Token", accessToken).json(user);
});

authRoute.post("/auth/signin", async (req, res) => {
  console.log("Test");
  console.log(req.body);
  const { email, password } = req.body as {
    email?: string;
    password?: string;
  };

  if (!email || !password) {
    return res.status(400).json({ error: "Invalid request, invalid payload." });
  }

  const whereClause = email.includes("@")
    ? { email: email }
    : { username: email };

  const user = await prisma.user.findUnique({
    where: whereClause,
  });

  if (!user) {
    return res.status(404).json({ error: "Error, no user found." });
  }

  const isPasswordCorrect = await bycrpt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res.status(401).json({ error: "Error, incorrect password." });
  }

  const accessToken = await createSession(user);

  res.header("Access-Token", accessToken).json(user);
});
