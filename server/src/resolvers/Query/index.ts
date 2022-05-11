import { postQueries } from "./post";
import { userQueries } from "./user";

const Query = {
  ...postQueries,
  ...userQueries,
};

export default Query;
