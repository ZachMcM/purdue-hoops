import { Router } from "express";
import { authMiddleware } from "./auth";
import prisma from "../prismaClient";

export const searchRoute = Router();

searchRoute.get("/users/search", authMiddleware, async (req, res) => {
  const query = req.query.query as string | null | undefined;

  console.log(query);

  if (!query) {
    return res.status(400).json({ error: "Invalid request, no search query." });
  }

  const users = await prisma.user.findMany({
    where: {
      OR: [
        {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          username: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
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

  if (!users) {
    return res.status(404).json({ error: "Error, no users found." });
  }

  return res.json(users);
});

searchRoute.post("/searches", authMiddleware, async (req, res) => {
  const outgoingId = res.locals.userId;
  const incomingId = req.body.userId as string | null | undefined;

  if (!incomingId) {
    return res
      .status(400)
      .json({ error: "Invalid request, no user id provided." });
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: outgoingId,
    },
    data: {
      outgoingSearches: { connect: { id: incomingId } },
    },
  });

  if (!updatedUser) {
    return res.status(404).json({ error: "Error, no user found." });
  }

  return res.json(updatedUser);
});

searchRoute.delete("/searches/:incomingId", authMiddleware, async (req, res) => {
  const outgoingId = res.locals.userId;
  const { incomingId } = req.params

  if (!incomingId) {
    return res
      .status(400)
      .json({ error: "Invalid request, no user id provided." });
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: outgoingId,
    },
    data: {
      outgoingSearches: { disconnect: { id: incomingId } },
    },
  });

  if (!updatedUser) {
    return res.status(404).json({ error: "Error, no user found." });
  }

  return res.json(updatedUser);
});

searchRoute.get("/searches", authMiddleware, async (req, res) => {
  const { userId } = res.locals;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
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
          hoopingStatus: true
        },
      },
    },
  });

  if (!user) {
    return res.status(404).json({ error: "Error, no user found." });
  }

  return res.json(user.outgoingSearches);
});
