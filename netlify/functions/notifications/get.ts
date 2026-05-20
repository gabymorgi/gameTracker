import { CustomHandler } from "../../types";

const getHandler: CustomHandler<"notifications/get"> = async (prisma) => {
  const notifications = await prisma.notification.findMany({
    orderBy: { createdAt: "desc" },
  });
  return notifications;
};

export default {
  path: "get",
  handler: getHandler,
  needsAuth: true,
};
