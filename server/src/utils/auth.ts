import { PrismaClient, User } from "@prisma/client";
import JWT from "jsonwebtoken";
import { UserErrors } from "../types";

export type AuthTokenPayload = {
  userId: number;
};

type IsAuthorizeParams = {
  prisma: PrismaClient;
  userInfo: AuthTokenPayload | null;
};

export const getUserFromToken = (
  token: string,
  secret: string
): AuthTokenPayload | null => {
  try {
    return JWT.verify(token, secret) as AuthTokenPayload;
  } catch (e) {
    return null;
  }
};

export function generateToken(user: User, secret: string): string {
  const payload: AuthTokenPayload = {
    userId: user.id,
  };
  return JWT.sign(payload, secret, {
    expiresIn: 3600000,
  });
}

export async function isAuthorize({
  prisma,
  userInfo,
}: IsAuthorizeParams): Promise<
  | { type: "authorize"; user: User }
  | { type: "unauthorize"; userErrors: UserErrors }
> {
  if (!userInfo)
    return {
      type: "unauthorize",
      userErrors: [
        {
          message: "Forbidden",
        },
      ],
    };

  const user = await prisma.user.findUnique({
    where: {
      id: userInfo.userId,
    },
  });
  if (!user) {
    return { type: "unauthorize", userErrors: [{ message: "User not found" }] };
  }
  return { type: "authorize", user };
}
