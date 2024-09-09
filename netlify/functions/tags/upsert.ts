import { CustomHandler } from "../../types";

interface Params {
  data: Array<{
    id: string;
    hue: string;
  }>;
}

const upsertHandler: CustomHandler = async (prisma, params: Params) => {
  const promises = params.data.map((tag) =>
    prisma.tags.upsert({
      where: {
        id: tag.id,
      },
      create: {
        hue: Number(tag.hue),
      },
      update: {
        hue: Number(tag.hue),
      },
    }),
  );

  const tags = await prisma.$transaction(promises);
  return tags;
};

export default {
  path: "upsert",
  handler: upsertHandler,
  needsAuth: true,
};
