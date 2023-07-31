import type { Handler } from "@netlify/functions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

const handler: Handler = async () => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };
  try {
    const states = await prisma.state.findMany()
    const tags = await prisma.tags.findMany()
    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({ states, tags })
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify(error)
    }
  }
};

export { handler };