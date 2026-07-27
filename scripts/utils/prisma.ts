import { PrismaClient, createPrismaClient } from "#prisma-client";

export default class Prisma {
  private static instance: PrismaClient | null = null;

  // avoid instantiation
  private constructor() {}

  public static getInstance(): PrismaClient {
    if (!Prisma.instance) {
      Prisma.instance = createPrismaClient();
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
