import { CustomHandler } from "../../types";

const getGlobalHandler: CustomHandler = async (prisma) => {
  const tags = await prisma.tags.findMany({
    orderBy: {
      id: "asc",
    },
  });
  return tags;
};

export default {
  path: "getGlobal",
  handler: getGlobalHandler,
  needsAuth: false,
};
