import { Post } from "@prisma/client";
import { Context } from "../context";

type PostCreateArgs = {
  post: {
    title: string | undefined;
    content: string | undefined;
  };
};

type PostPayloadType = {
  userErrors: {
    message: string;
  }[];
  post: Post | null;
};

type PostUpdateArgs = { postId: string } & PostCreateArgs;

export const Mutation = {
  postCreate: async (
    _: unknown,
    { post: { title, content } }: PostCreateArgs,
    { prisma }: Context
  ): Promise<PostPayloadType> => {
    const userErrors: { message: string }[] = [];
    if (!title || !content) {
      !title && userErrors.push({ message: "Title is required" });
      !content && userErrors.push({ message: "Content is required" });
      return { userErrors, post: null };
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: 1,
      },
    });
    return {
      userErrors: [],
      post,
    };
  },
  postUpdate: async (
    _: unknown,
    { postId, post: { title, content } }: PostUpdateArgs,
    { prisma }: Context
  ): Promise<PostPayloadType> => {
    const userErrors: { message: string }[] = [];
    if (!title && !content) {
      userErrors.push({ message: "Title or content are required" });
    }
    if (userErrors.length > 0) {
      return { userErrors, post: null };
    }
    const post = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });
    if (!post) {
      return {
        userErrors: [{ message: "Post not found" }],
        post: null,
      };
    }

    let payloadToUpdate = {
      title,
      content,
    };
    if (!payloadToUpdate.title) delete payloadToUpdate.title;
    if (!content) delete payloadToUpdate.content;

    return {
      userErrors: [],
      post: await prisma.post.update({
        where: {
          id: Number(postId),
        },
        data: payloadToUpdate,
      }),
    };
  },
  postDelete: async (
    _: unknown,
    { postId }: { postId: string },
    { prisma }: Context
  ): Promise<PostPayloadType> => {
    const post = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });
    if (!post) {
      return {
        userErrors: [{ message: "Post not found" }],
        post: null,
      };
    }
    return {
      userErrors: [],
      post: await prisma.post.delete({
        where: {
          id: Number(postId),
        },
      }),
    };
  },
};
