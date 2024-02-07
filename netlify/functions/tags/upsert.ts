import { CustomHandler } from "../../types";

interface Tags {
  id: string;
  hue: string;
}

const upsertHandler: CustomHandler = async (prisma, _, params: Array<Tags>) => {
  const tagPromises = params.map((tag) =>
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
  const tags = await prisma.$transaction(tagPromises);
  return tags;
};

export default {
  path: "upsert",
  handler: upsertHandler,
  needsAuth: true,
};
