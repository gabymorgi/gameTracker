import { CustomHandler } from "../../types";

const getGlobalHandler: CustomHandler = async (prisma) => {
  const states = await prisma.state.findMany();
  const tags = await prisma.tags.findMany();
  return { states, tags };
};

export default {
  path: "getGlobal",
  handler: getGlobalHandler,
  needsAuth: false,
};
