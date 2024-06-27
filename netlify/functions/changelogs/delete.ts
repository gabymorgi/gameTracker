import { CustomHandler } from "../../types";

interface UrlParams {
  id: string;
}

const deleteHandler: CustomHandler = async (prisma, urlParams: UrlParams) => {
  const deletedChangelog = await prisma.changeLog.delete({
    where: { id: urlParams.id },
  });
  return deletedChangelog;
};

export default {
  path: "delete",
  handler: deleteHandler,
  needsAuth: true,
};
