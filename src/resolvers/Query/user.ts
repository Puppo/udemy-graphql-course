import { Profile, User } from "@prisma/client";
import { BlogAppContext } from "../../context";
import { isAuthorize } from "../../utils";

export const userQueries = {
  me: async (
    _: unknown,
    __: any,
    { prisma, userInfo }: BlogAppContext
  ): Promise<User | null> => {
    const isAuthorizeResult = await isAuthorize({
      prisma,
      userInfo,
    });

    if (isAuthorizeResult.type === "unauthorize") return null;

    return isAuthorizeResult.user;
  },
  profile: async (
    _: unknown,
    { userId }: { userId: string },
    { prisma }: BlogAppContext
  ): Promise<Profile | null> => {
    return await prisma.profile.findUnique({
      where: {
        userId: Number(userId),
      },
    });
  },
};
