import { authResolvers } from "./auth";
import { postResolvers } from "./post";

const Mutation = {
  ...postResolvers,
  ...authResolvers,
};

export default Mutation;
