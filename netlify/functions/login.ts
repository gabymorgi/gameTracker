import type { Handler } from "@netlify/functions";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient()

function generateAdminToken(adminId: string) {
  const payload = {
    sub: adminId,
    role: "admin",
  };

  return jwt.sign(payload, process.env.VITE_JWT_SECRET || '', {
    expiresIn: "7d",
  });
}

const handler: Handler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const { email, password } = body;
    const admin = await prisma.admin.findUnique({
      where: {
        email,
      },
    });

    if (!admin || admin.password !== password) {
      return {
        statusCode: 401,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: "Invalid credentials" })
      }
    }

    const token = generateAdminToken(admin.id);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    }
  } catch (error) {
    console.error(error)
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(error)
    }
  }
};

export { handler };