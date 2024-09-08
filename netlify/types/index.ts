import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";
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

export type OpenAIHandler<U = $SafeAny> = (
  prisma: OpenAI,
  params: U,
) => Promise<GenericObject>;

export interface RouteOpenAIHandler {
  path: string;
  needsAuth?: boolean;
  handler: OpenAIHandler;
}

export type CRUDArray<T> = {
  create: Array<T>;
  update: Array<T>;
  delete: Array<string>;
};
