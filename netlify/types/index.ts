import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";

export type GenericObject = Record<string, any>;

export type CustomHandler<U = any> = (
  prisma: PrismaClient,
  params: U,
) => Promise<GenericObject>;

export interface RouteHandler {
  path: string;
  needsAuth?: boolean;
  handler: CustomHandler;
}

export type OpenAIHandler<U = any> = (
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
