import { BlogAppContext } from "../context";

type PostParentType = {
  authorId: number;
};

const Post = {
  user: (
    { authorId }: PostParentType,
    _: unknown,
    { prisma }: BlogAppContext
  ) => {
    return prisma.user.findUnique({
      where: {
        id: authorId,
      },
    });
  },
};

export default Post;
