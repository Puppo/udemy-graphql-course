import { Post } from "@prisma/client";
import { BlogAppContext } from "../../context";

export const postQueries = {
  posts: async (
    _: unknown,
    __: any,
    { prisma }: BlogAppContext
  ): Promise<Post[]> => {
    return prisma.post.findMany({
      where: {
        published: true,
      },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
    });
  },
};
