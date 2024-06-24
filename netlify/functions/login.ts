import type { Config } from "@netlify/functions";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

function generateAdminToken(adminId: string) {
  const payload = {
    sub: adminId,
    role: "admin",
  };

  return jwt.sign(payload, process.env.VITE_JWT_SECRET || "", {
    expiresIn: "30d",
  });
}

const handler = async (request: Request) => {
  try {
    const body = JSON.parse((await request.json()) || "{}");
    const { email, password } = body;
    const admin = await prisma.admin.findUnique({
      where: {
        email,
      },
    });

    if (!admin || admin.password !== password) {
      return Response.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const token = generateAdminToken(admin.id);

    return Response.json({ token }, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

export const config: Config = {
  path: "/api/login",
};

export default handler;
