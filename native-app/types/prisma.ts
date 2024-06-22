import { Prisma } from "purdue-hoops-prisma-schema";

export type PartialUser = Prisma.UserGetPayload<{
  select: {
    id: true;
    name: true;
    username: true;
    feet: true;
    inches: true;
    weight: true;
    position: true;
    primarySkill: true;
    secondarySkill: true;
    image: true;
    overallRating: true;
    hoopingStatus: true
  };
  include: {
    hoopSessions: true;
    incomingRatings: true;
  };
}>;

export type UserPreview = Prisma.UserGetPayload<{
  select: {
    id: true;
    name: true;
    image: true;
    incomingRatings: true;
    position: true;
    primarySkill: true;
    secondarySkill: true;
    overallRating: true;
    hoopingStatus: true
  };
}>;
