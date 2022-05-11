import { Post } from "@prisma/client";
import { BlogAppContext } from "../../context";
import { UserErrors } from "../../types";
import { canUserMutatePost, isAuthorize } from "../../utils";

type PostCreateArgs = {
  post: {
    title: string | undefined;
    content: string | undefined;
  };
};

type PostPayloadType = {
  userErrors: UserErrors;
  post: Post | null;
};

type PostUpdateArgs = { postId: string } & PostCreateArgs;

export const postResolvers = {
  postCreate: async (
    _: unknown,
    { post: { title, content } }: PostCreateArgs,
    { prisma, userInfo }: BlogAppContext
  ): Promise<PostPayloadType> => {
    const isAuthorizeResult = await isAuthorize({
      prisma,
      userInfo,
    });
    if (isAuthorizeResult.type === "unauthorize") {
      return { userErrors: isAuthorizeResult.userErrors, post: null };
    }

    const userErrors: UserErrors = [];
    if (!title || !content) {
      !title && userErrors.push({ message: "Title is required" });
      !content && userErrors.push({ message: "Content is required" });
      return { userErrors, post: null };
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: isAuthorizeResult.user.id,
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
    { prisma, userInfo }: BlogAppContext
  ): Promise<PostPayloadType> => {
    const isAuthorizeResult = await isAuthorize({
      prisma,
      userInfo,
    });
    if (isAuthorizeResult.type === "unauthorize") {
      return { userErrors: isAuthorizeResult.userErrors, post: null };
    }

    const canUserMutatePostResult = await canUserMutatePost({
      prisma,
      postId: Number(postId),
      user: isAuthorizeResult.user,
    });

    if (canUserMutatePostResult.type === "unauthorize") {
      return { userErrors: canUserMutatePostResult.userErrors, post: null };
    }

    if (!title && !content) {
      return {
        userErrors: [{ message: "Title or content are required" }],
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
          id: canUserMutatePostResult.post.id,
        },
        data: payloadToUpdate,
      }),
    };
  },
  postDelete: async (
    _: unknown,
    { postId }: { postId: string },
    { prisma, userInfo }: BlogAppContext
  ): Promise<PostPayloadType> => {
    const isAuthorizeResult = await isAuthorize({
      prisma,
      userInfo,
    });
    if (isAuthorizeResult.type === "unauthorize") {
      return { userErrors: isAuthorizeResult.userErrors, post: null };
    }

    const canUserMutatePostResult = await canUserMutatePost({
      prisma,
      postId: Number(postId),
      user: isAuthorizeResult.user,
    });

    if (canUserMutatePostResult.type === "unauthorize") {
      return { userErrors: canUserMutatePostResult.userErrors, post: null };
    }
    return {
      userErrors: [],
      post: await prisma.post.delete({
        where: {
          id: canUserMutatePostResult.post.id,
        },
      }),
    };
  },
  postPublish: async (
    _: unknown,
    { postId }: { postId: string },
    { prisma, userInfo }: BlogAppContext
  ): Promise<PostPayloadType> => {
    const isAuthorizeResult = await isAuthorize({
      prisma,
      userInfo,
    });
    if (isAuthorizeResult.type === "unauthorize") {
      return { userErrors: isAuthorizeResult.userErrors, post: null };
    }

    const canUserMutatePostResult = await canUserMutatePost({
      prisma,
      postId: Number(postId),
      user: isAuthorizeResult.user,
    });

    if (canUserMutatePostResult.type === "unauthorize") {
      return { userErrors: canUserMutatePostResult.userErrors, post: null };
    }
    return {
      userErrors: [],
      post: await prisma.post.update({
        where: {
          id: canUserMutatePostResult.post.id,
        },
        data: {
          published: true,
        },
      }),
    };
  },
  postUnpublish: async (
    _: unknown,
    { postId }: { postId: string },
    { prisma, userInfo }: BlogAppContext
  ): Promise<PostPayloadType> => {
    const isAuthorizeResult = await isAuthorize({
      prisma,
      userInfo,
    });
    if (isAuthorizeResult.type === "unauthorize") {
      return { userErrors: isAuthorizeResult.userErrors, post: null };
    }

    const canUserMutatePostResult = await canUserMutatePost({
      prisma,
      postId: Number(postId),
      user: isAuthorizeResult.user,
    });

    if (canUserMutatePostResult.type === "unauthorize") {
      return { userErrors: canUserMutatePostResult.userErrors, post: null };
    }
    return {
      userErrors: [],
      post: await prisma.post.update({
        where: {
          id: canUserMutatePostResult.post.id,
        },
        data: {
          published: false,
        },
      }),
    };
  },
};
