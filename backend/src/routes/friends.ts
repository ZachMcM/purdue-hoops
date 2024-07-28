import { Router } from "express";
import prisma from "../prismaClient";
import { authMiddleware } from "./auth";

export const friendsRoute = Router();

friendsRoute.get("/friends/all", authMiddleware, async (req, res) => {
  const userId = res.locals.userId;

  const friends = await prisma.friendship.findMany({
    where: {
      OR: [
        { incomingId: userId },
        { outgoingId: userId }
      ],
      status: "accepted",
    },
    include: {
      incomingUser: {
        select: {
          id: true,
          name: true,
          image: true,
          incomingRatings: true,
          position: true,
          primarySkill: true,
          secondarySkill: true,
          overallRating: true,
          hoopingStatus: true,
        },
      },
      outgoingUser: {
        select: {
          id: true,
          name: true,
          image: true,
          incomingRatings: true,
          position: true,
          primarySkill: true,
          secondarySkill: true,
          overallRating: true,
          hoopingStatus: true,
        },
      },
    },
  });

  return res.json(friends);
});

friendsRoute.get(
  "/friends/requests/incoming",
  authMiddleware,
  async (req, res) => {
    const userId = res.locals.userId;

    const incomingFriendRequests = await prisma.friendship.findMany({
      where: {
        incomingId: userId,
        status: "pending",
      },
      include: {
        outgoingUser: {
          select: {
            id: true,
            name: true,
            image: true,
            incomingRatings: true,
            position: true,
            primarySkill: true,
            secondarySkill: true,
            overallRating: true,
            hoopingStatus: true,
          },
        },
      },
    });

    return res.json(incomingFriendRequests);
  }
);

// endpoint for retrieving friendship status when user is on the page

friendsRoute.get(
  "/friends/status/:userId",
  authMiddleware,
  async (req, res) => {
    console.log("Getting friendship status")

    const sessionUser = res.locals.userId;

    const { userId } = req.params;

    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          {
            incomingId: sessionUser,
            outgoingId: userId
          },
          {
            incomingId: userId,
            outgoingId: sessionUser
          }
        ]
      },
    });

    return res.json(friendship)
  }
);

friendsRoute.put(
  "/friends/requests/incoming/:friendshipId",
  authMiddleware,
  async (req, res) => {
    const userId = res.locals.userId;
    const { friendshipId } = req.params;

    const acceptedFriendship = await prisma.friendship.update({
      where: {
        incomingId: userId,
        id: friendshipId,
      },
      data: {
        status: "accepted",
      },
    });

    return res.json(acceptedFriendship);
  }
);

friendsRoute.delete(
  "/friends/requests/:friendshipId",
  authMiddleware,
  async (req, res) => {
    const userId = res.locals.userId;
    const { friendshipId } = req.params;

    const deletedFriendship = await prisma.friendship.delete({
      where: {
        id: friendshipId,
        OR: [
          {
            incomingId: userId,
          },
          {
            outgoingId: userId,
          },
        ],
      },
    });

    return res.json(deletedFriendship);
  }
);

friendsRoute.post("/friends/requests", authMiddleware, async (req, res) => {
  const outgoingId = res.locals.userId;

  const { incomingId } = req.body as {
    incomingId: string | null | undefined;
  };

  if (!incomingId) {
    return res.status(404).json({ error: "Error, no user found." });
  }

  const newFriendship = await prisma.friendship.create({
    data: {
      incomingId,
      outgoingId,
    },
  });

  return res.json(newFriendship);
});
