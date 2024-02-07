import { PrismaClient } from "@prisma/client";

export type TransactionalPrismaClient = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

export type GenericObject = { [key: string]: any };

export type CustomHandler<T = any, U = any> = (
  prisma: PrismaClient,
  urlParams: T,
  params: U,
) => Promise<GenericObject>;

export interface RouteHandlers {
  path: string;
  needsAuth?: boolean;
  handler: CustomHandler;
}

export type CRUDArray<T> = {
  create: Array<T>;
  update: Array<T>;
  delete: Array<string>;
};
