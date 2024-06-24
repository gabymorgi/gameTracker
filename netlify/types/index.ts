import { PrismaClient } from "@prisma/client";

export type GenericObject = { [key: string]: any };

export type CustomHandler<U = any> = (
  prisma: PrismaClient,
  params: U,
) => Promise<GenericObject>;

export interface RouteHandler {
  path: string;
  needsAuth?: boolean;
  handler: CustomHandler;
}

export type CRUDArray<T> = {
  create: Array<T>;
  update: Array<T>;
  delete: Array<string>;
};
