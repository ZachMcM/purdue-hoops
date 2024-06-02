import { Router } from "express";
import prisma from "../prismaClient";
import { authMiddleware } from "./auth";

export const statusRoute = Router();

statusRoute.get("/status", authMiddleware, async (req, res) => {
  const { userId } = res.locals;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      hoopingStatus: true,
    },
  });

  console.log(user);

  return res.json(user);
});

statusRoute.put("/status", authMiddleware, async (req, res) => {
  const { userId } = res.locals;
  const { status } = req.body as { status: string };

  const data =
    status == "not-hooping"
      ? {
          hoopingStatus: status,
        }
      : {
          hoopingStatus: status,
          hoopSessions: {
            create: {
              gym: status,
            },
          },
        };

  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data,
    select: {
      hoopingStatus: true,
    },
  });

  return res.json(user);
});
