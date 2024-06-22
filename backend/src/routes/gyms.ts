import { Router } from "express";
import { authMiddleware } from "./auth";
import prisma from "../prismaClient";

export const gymsRoute = Router();

gymsRoute.get("/gyms", authMiddleware, async (req, res) => {
  const gym = req.query.gym as string | null | undefined;

  if (gym != "gold-and-black" && gym != "feature" && gym != "upper") {
    return res.status(400).json({ error: "Invalid request, no gym provided." });
  }

  const users = await prisma.user.findMany({
    where: {
      hoopingStatus: gym,
    },
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
  });

  return res.json(users);
});
