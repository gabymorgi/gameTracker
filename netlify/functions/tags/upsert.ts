import { Prisma } from "@prisma/client";
import { CustomHandler } from "../../types";

interface Params {
  type: "tags" | "states";
  data: Array<{
    id: string;
    hue: string;
  }>;
}

const upsertHandler: CustomHandler = async (prisma, params: Params) => {
  let promises: Prisma.PrismaPromise<unknown>[];
  if (params.type === "tags") {
    promises = params.data.map((tag) =>
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
  } else {
    promises = params.data.map((tag) =>
      prisma.state.upsert({
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
  }
  const tags = await prisma.$transaction(promises);
  return tags;
};

export default {
  path: "upsert",
  handler: upsertHandler,
  needsAuth: true,
};
