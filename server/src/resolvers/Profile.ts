import { BlogAppContext } from "../context";

type ProfileParentType = {
  id: number;
  bio: string;
  userId: number;
};

const Profile = {
  user: (
    profile: ProfileParentType,
    _: unknown,
    { prisma }: BlogAppContext
  ) => {
    return prisma.user.findUnique({
      where: {
        id: profile.userId,
      },
    });
  },
};

export default Profile;
