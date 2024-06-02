import { User } from "@prisma/client";
import jwt from "jsonwebtoken";

export async function createSession(user: User) {
  const payload = {
    userId: user.id,
    email: user.email,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "365 days",
  });

  return accessToken;
}
