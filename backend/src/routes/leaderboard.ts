import { Router } from "express";
import { authMiddleware } from "./auth";
import prisma from "../prismaClient";

export const leaderboardRoute = Router();

leaderboardRoute.get("/users/leaderboard", authMiddleware, async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      image: true,
      incomingRatings: true,
      position: true,
      primarySkill: true,
      secondarySkill: true,
      overallRating: true,
      hoopingStatus: true
    },
    orderBy: [
      {
        incomingRatings: {
          _count: "desc",
        },
      },
      {
        overallRating: "desc",
      },
    ],
    take: 100,
  });

  return res.json(users);
});
