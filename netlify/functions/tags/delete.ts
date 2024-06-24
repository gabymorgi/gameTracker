import { CustomHandler } from "../../types";

interface Params {
  id: string;
  type: "tags" | "states";
}

const deleteHandler: CustomHandler<Params> = async (prisma, params) => {
  switch (params.type) {
    case "tags":
      const deletedTag = await prisma.tags.delete({
        where: { id: params.id },
      });
      return deletedTag;
    case "states":
      const deletedState = await prisma.state.delete({
        where: { id: params.id },
      });
      return deletedState;
  }
};

export default {
  path: "delete",
  handler: deleteHandler,
  needsAuth: true,
};
