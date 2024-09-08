import { CustomHandler } from "../../types";

const handler: CustomHandler<"tags/get"> = async (prisma) => {
  return await prisma.tags.findMany({
    orderBy: {
      id: "asc",
    },
  });
};

export default {
  path: "getGlobal",
  handler: handler,
  needsAuth: false,
};
