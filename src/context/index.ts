import { PrismaClient } from "@prisma/client";
import { IncomingMessage } from "http";
import { z } from "zod";
import { AuthTokenPayload, getUserFromToken } from "../utils";

const envSchema = z.object({
  JWT_SECRET: z.string(),
  DATABASE_URL: z.string(),
});
type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  return envSchema.parse(process.env);
}

export const prisma = new PrismaClient();
const env = loadEnv();

export type BlogAppContext = {
  prisma: PrismaClient;
  env: Env;
  userInfo: AuthTokenPayload | null;
};

export const context = async ({
  req,
}: {
  req: IncomingMessage;
}): Promise<BlogAppContext> => {
  const token = req.headers.authorization;
  const userInfo = token ? await getUserFromToken(token, env.JWT_SECRET) : null;

  return { prisma, env, userInfo };
};
