import { CustomHandler } from "../../types";

const deleteHandler: CustomHandler<"notifications/delete"> = async (
  prisma,
  params,
) => {
  const deleted = await prisma.notification.delete({
    where: { id: params.id },
  });
  return { id: deleted.id };
};

export default {
  path: "delete",
  handler: deleteHandler,
  needsAuth: true,
};
