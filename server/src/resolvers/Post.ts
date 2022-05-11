import { userLoader } from "../loaders/useLoader";

type PostParentType = {
  authorId: number;
};

const Post = {
  user: ({ authorId }: PostParentType, _: unknown) => {
    return userLoader.load(authorId);
  },
};

export default Post;
