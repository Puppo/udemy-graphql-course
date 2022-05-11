import { BlogAppContext } from "../context";

type UserParentType = {
  id: number;
};

const User = {
  posts: (
    { id }: UserParentType,
    _: unknown,
    { prisma, userInfo }: BlogAppContext
  ) => {
    const isOwnerProfile = userInfo?.userId === id;
    return prisma.post.findMany({
      where: {
        authorId: id,
        ...(!isOwnerProfile ? { published: true } : {}),
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },
};

export default User;
