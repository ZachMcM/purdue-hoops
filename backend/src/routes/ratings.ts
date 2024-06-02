import { Router } from "express";
import prisma from "../prismaClient";
import { authMiddleware } from "./auth";

export const ratingsRoute = Router();

ratingsRoute.put("/users/:userId/ratings", authMiddleware, async (req, res) => {
  const outgoingId = res.locals.userId;
  const incomingId = req.params.userId;

  console.log("Outgoung: %s", outgoingId);

  const { value } = req.body as { value?: number | null };

  if (!value) {
    return res.status(400).json({ error: "Invalid request, invalid payload." });
  }

  const currRating = await prisma.rating.findUnique({
    where: {
      ratingId: {
        outgoingId,
        incomingId,
      },
    },
  });

  const incomingRatings = currRating
    ? {
        update: {
          where: {
            ratingId: {
              incomingId,
              outgoingId,
            },
          },
          data: {
            value,
          },
        },
      }
    : {
        create: {
          outgoingId,
          value,
        },
      };

  const userWithNewRating = await prisma.user.update({
    where: {
      id: incomingId,
    },
    data: {
      incomingRatings,
    },
    select: {
      incomingRatings: true,
    },
  });

  const newOvr =
    userWithNewRating.incomingRatings
      .map((rating) => rating.value)
      .reduce((acc, curr) => acc + curr, 0) /
    userWithNewRating.incomingRatings.length;

  const updatedUser = await prisma.user.update({
    where: {
      id: incomingId,
    },
    data: {
      overallRating: newOvr,
    },
    select: {
      overallRating: true,
    },
  });

  return res.json(updatedUser);
});
