import { CustomHandler } from "../../types";

const upsertHandler: CustomHandler<"tags/upsert"> = async (prisma, params) => {
  const updatedTag = await prisma.tags.upsert({
    where: {
      id: params.id,
    },
    create: {
      hue: Number(params.hue),
    },
    update: {
      hue: Number(params.hue),
    },
  });

  return updatedTag;
};

export default {
  path: "upsert",
  handler: upsertHandler,
  needsAuth: true,
};
