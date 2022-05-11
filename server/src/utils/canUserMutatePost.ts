import { Post, PrismaClient, User } from "@prisma/client";
import { UserErrors } from "../types";

type CanUserMutatePostParams = {
  prisma: PrismaClient;
  user: User;
  postId: number;
};

export async function canUserMutatePost({
  prisma,
  postId,
  user,
}: CanUserMutatePostParams): Promise<
  | {
      type: "authorize";
      post: Post;
    }
  | {
      type: "unauthorize";
      userErrors: UserErrors;
    }
> {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });
  if (!post) {
    return { type: "unauthorize", userErrors: [{ message: "Post not found" }] };
  }
  if (post.authorId !== user.id) {
    return {
      type: "unauthorize",
      userErrors: [{ message: "You are not the author of this post" }],
    };
  }

  return {
    type: "authorize",
    post,
  };
}
