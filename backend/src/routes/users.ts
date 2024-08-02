import { Router } from "express";
import { supabase } from "../supabase/client";
import { authMiddleware } from "./auth";
import { decode } from "base64-arraybuffer";
import { v4 as uuidv4 } from "uuid";
import prisma from "../prismaClient";
import { ratingsRoute } from "./ratings";
import { statusRoute } from "./status";
import { leaderboardRoute } from "./leaderboard";
import { searchRoute } from "./search";

export const usersRoute = Router();

usersRoute.use(ratingsRoute);
usersRoute.use(statusRoute);
usersRoute.use(leaderboardRoute);
usersRoute.use(searchRoute);

usersRoute.delete("/users", authMiddleware, async (req, res) => {
  const { userId } = res.locals;

  const user = await prisma.user.delete({
    where: {
      id: userId,
    },
  });

  return res.json(user);
});

usersRoute.get("/users/:userId", authMiddleware, async (req, res) => {
  const { userId } = req.params;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      username: true,
      feet: true,
      inches: true,
      weight: true,
      position: true,
      primarySkill: true,
      secondarySkill: true,
      image: true,
      hoopingStatus: true,
      hoopSessions: true,
      incomingRatings: true,
      overallRating: true,
      password: false,
      outgoingFriendships: true,
      incomingFriendships: true,
    },
  });

  if (!user) {
    return res.status(404).json({ error: "Error, no user found." });
  }

  console.log(user);

  return res.json(user);
});

usersRoute.put("/users/account/setup", authMiddleware, async (req, res) => {
  const userId = res.locals.userId;

  console.log(req.body)

  const { inches, feet, weight, position, primarySkill, secondarySkill } =
    req.body as {
      inches?: number;
      feet?: number;
      weight?: number;
      position?: string;
      primarySkill?: string;
      secondarySkill?: string;
    };

    if (!inches || !feet || !weight || !position || !primarySkill || !secondarySkill) {
      return res.status(404).json({ error: "Error, invalid payload." });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        inches,
        feet,
        weight,
        position,
        primarySkill,
        secondarySkill
      }
    })

    return res.json(updatedUser)
});

usersRoute.put("/users/account", authMiddleware, async (req, res) => {
  const userId = res.locals.userId;

  const { name, username, email } = req.body as {
    name?: string;
    username?: string;
    email?: string;
  };

  if (!name || !username || !email) {
    return res.status(400).json({ error: "Invalid request, invalid payload." });
  }

  if (!email.endsWith("@purdue.edu")) {
    return res
      .status(400)
      .json({ error: "Invalid request, must have purdue.edu email." });
  }

  const sameEmail = await prisma.user.findFirst({
    where: {
      NOT: {
        id: userId,
      },
      email: email,
    },
  });

  if (sameEmail) {
    return res
      .status(400)
      .json({ error: "Error, a user with this email already exists." });
  }

  const sameUsername = await prisma.user.findFirst({
    where: {
      NOT: {
        id: userId,
      },
      username: username,
    },
  });

  if (sameUsername) {
    return res
      .status(400)
      .json({ error: "Error, a user with this username already exists." });
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name,
      username,
      email,
    },
  });

  if (!updatedUser) {
    return res.status(404).json({ error: "Error, no user found." });
  }

  return res.json(updatedUser);
});

usersRoute.put("/users/profile", authMiddleware, async (req, res) => {
  const userId = res.locals.userId;

  const { height, weight, position, primarySkill, secondarySkill, image } =
    req.body as {
      height?: {
        feet: number;
        inches: number;
      };
      weight?: number;
      position?: string;
      primarySkill?: string;
      secondarySkill?: string;
      image?: any;
    };

  if (!height || !weight || !position || !primarySkill || !secondarySkill) {
    return res.status(400).json({ error: "Invalid request, invalid payload" });
  }

  if (image) {
    let path;
    if (image.fileName) {
      path = image.fileName;
    } else {
      path = `${uuidv4()}.${image.mimeType.split("/")[1]}`;
    }

    const { data, error } = await supabase.storage
      .from("images")
      .upload(path, decode(image.base64), {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.log(error);
      return res.status(500).json({ error: "Error uploading image" });
    } else {
      console.log(data);
      const imageUrl = supabase.storage.from("images").getPublicUrl(data.path)
        .data.publicUrl;

      const updatedUser = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          feet: height.feet,
          inches: height.inches,
          weight,
          position,
          primarySkill,
          secondarySkill,
          image: imageUrl,
        },
      });

      return res.json(updatedUser);
    }
  } else {
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        feet: height.feet,
        inches: height.inches,
        weight,
        position,
        primarySkill,
        secondarySkill,
      },
    });

    return res.json(updatedUser);
  }
});
