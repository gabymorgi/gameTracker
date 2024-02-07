import { CustomHandler } from "../../types";

interface UrlParams {
  id: string;
}

interface Params {
  type: "tags" | "states";
}

const deleteHandler: CustomHandler<UrlParams, Params> = async (
  prisma,
  urlParams,
  params,
) => {
  switch (params.type) {
    case "tags":
      const deletedTag = await prisma.tags.delete({
        where: { id: urlParams.id },
      });
      return deletedTag;
    case "states":
      const deletedState = await prisma.state.delete({
        where: { id: urlParams.id },
      });
      return deletedState;
  }
};

export default {
  path: "delete/:id",
  handler: deleteHandler,
  needsAuth: true,
};
