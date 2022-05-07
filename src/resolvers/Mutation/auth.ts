import bcryptjs from "bcryptjs";
import validator from "validator";
import { BlogAppContext } from "../../context";
import { UserErrors } from "../../types";
import { generateToken } from "../../utils";

type CredentialsInput = {
  email: string;
  password: string;
};

type SignUpArgs = {
  user: {
    credentials: CredentialsInput;
    username: string;
    name: string;
    bio: string;
  };
};

type SignInArgs = {
  credentials: CredentialsInput;
};

type AuthPayloadType = {
  userErrors: UserErrors;
  token: string | null;
};

export const authResolvers = {
  signUp: async (
    _: unknown,
    {
      user: {
        credentials: { email, password },
        username,
        bio,
        name,
      },
    }: SignUpArgs,
    { prisma, env }: BlogAppContext
  ): Promise<AuthPayloadType> => {
    const userErrors: UserErrors = [];
    if (!validator.isEmail(email)) {
      userErrors.push({ message: "Email is invalid" });
    }
    if (!validator.isLength(password, { min: 5 })) {
      userErrors.push({ message: "Password is too short" });
    }
    if (!validator.isLength(username, { min: 3 })) {
      userErrors.push({ message: "Username is too short" });
    }

    if (userErrors.length > 0) {
      return { userErrors, token: null };
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        username,
        profile: {
          create: {
            bio,
          },
        },
      },
    });

    const token = generateToken(user, env.JWT_SECRET);

    return {
      userErrors: [],
      token,
    };
  },
  signIn: async (
    _: unknown,
    { credentials: { email, password } }: SignInArgs,
    { prisma, env }: BlogAppContext
  ): Promise<AuthPayloadType> => {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return {
        userErrors: [{ message: "Email or password is invalid" }],
        token: null,
      };
    }
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return {
        userErrors: [{ message: "Email or password is invalid" }],
        token: null,
      };
    }

    const token = generateToken(user, env.JWT_SECRET);
    return {
      userErrors: [],
      token,
    };
  },
};
