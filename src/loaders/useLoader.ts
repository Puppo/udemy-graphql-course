import { User } from "@prisma/client";
import DataLoader from "dataloader";
import { prisma } from "../context";

const batchUsers = async (ids: ReadonlyArray<number>): Promise<User[]> => {
  const users = await prisma.user.findMany({
    where: {
      id: {
        in: ids.slice(),
      },
    },
  });
  const userMap = users.reduce<Record<string, User>>((acc, curr) => {
    acc[curr.id] = curr;
    return acc;
  }, {});
  return ids.map(id => userMap[id]);
};

export const userLoader = new DataLoader<number, User>(batchUsers);
