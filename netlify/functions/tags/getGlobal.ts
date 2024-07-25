import { CustomHandler } from "../../types";

const getGlobalHandler: CustomHandler = async (prisma) => {
  const states = await prisma.state.findMany({
    orderBy: {
      id: "asc",
    },
  });
  const tags = await prisma.tags.findMany({
    orderBy: {
      id: "asc",
    },
  });
  return { states, tags };
};

export default {
  path: "getGlobal",
  handler: getGlobalHandler,
  needsAuth: false,
};
