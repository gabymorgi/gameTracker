import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type $SafeAny = any;
export type GenericObject = Record<string, $SafeAny>;

export type CustomHandler<U = $SafeAny> = (
  prisma: PrismaClient,
  params: U,
) => Promise<GenericObject>;

export interface RouteHandler {
  path: string;
  needsAuth?: boolean;
  handler: CustomHandler;
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
