import { PrismaClient } from "@prisma/client";

export default class Prisma {
  private static instance: PrismaClient;

  // avoid instantiation
  private constructor() {}

  public static getInstance(): PrismaClient {
    if (!Prisma.instance) {
      Prisma.instance = new PrismaClient();
    }
    return Prisma.instance;
  }

  public static async disconnect() {
    if (Prisma.instance) {
      await Prisma.instance.$disconnect();
      Prisma.instance = null;
    }
  }
}
