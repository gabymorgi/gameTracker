import { PrismaClient } from "@prisma/client";
import { ApiPaths } from "../../src/ts/api";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type $SafeAny = any;
export type GenericObject = Record<string, $SafeAny>;

export type PostParams<T> = {
  [P in keyof T]: T[P] extends Date ? string : T[P];
};

export type CustomHandler<TPath extends keyof ApiPaths> = (
  prisma: PrismaClient,
  params: ApiPaths[TPath]["params"],
) => Promise<ApiPaths[TPath]["response"]>;

export interface RouteHandler {
  path: string;
  needsAuth?: boolean;
  handler: CustomHandler<$SafeAny>;
}
