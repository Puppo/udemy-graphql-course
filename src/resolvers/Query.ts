import { Post } from "@prisma/client";
import { Context } from "../context";

export const Query = {
  posts: async (_: unknown, __: any, { prisma }: Context): Promise<Post[]> => {
    return prisma.post.findMany({
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
    });
  },
};
