import { CustomHandler } from "../../types";

const deleteHandler: CustomHandler<"changelogs/delete"> = async (
  prisma,
  params,
) => {
  const deletedChangelog = await prisma.changelog.delete({
    where: { id: params.id },
  });
  return deletedChangelog;
};

export default {
  path: "delete",
  handler: deleteHandler,
  needsAuth: true,
};
