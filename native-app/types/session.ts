import { Prisma } from "purdue-hoops-prisma-schema";

export type Session =
  | {
      user: Omit<
        Prisma.UserGetPayload<{
          include: {
            incomingRatings: true;
            outgoingRatings: true;
            hoopSessions: true;
            incomingSearches: {
              select: {
                id: true;
                name: true;
                image: true;
                incomingRatings: true;
                position: true;
                primarySkill: true;
                secondarySkill: true;
                overallRating: true;
              };
            };
            outgoingSearches: {
              select: {
                id: true;
                name: true;
                image: true;
                incomingRatings: true;
                position: true;
                primarySkill: true;
                secondarySkill: true;
                overallRating: true;
              };
            };
            outgoingFriendships: true,
            incomingFriendships: true
          };
        }>,
        "password"
      >;
      userId: string;
    }
  | null
  | undefined;

export type SessionProviderValues = {
  session: Session;
  signIn: ({ email, password }: { email: string; password: string }) => void;
  signOut: () => void;
  signUp: ({
    name,
    username,
    email,
    password,
  }: {
    name: string;
    username: string;
    email: string;
    password: string;
  }) => void;
  isSignInPending: boolean;
  isSignUpPending: boolean;
  isSessionPending: boolean;
  isSessionFetching: boolean;
  isSignOutPending: boolean;
  isSetUpPending: boolean
  setUp: ({
    position,
    height,
    weight,
    primarySkill,
    secondarySkill
  }: {
    position: string,
    height: {
      inches: number,
      feet: number
    },
    weight: number,
    primarySkill: string,
    secondarySkill: string
  }) => void
};
