import type { Config, Context } from "@netlify/functions";
import jwt from "jsonwebtoken";
import { CustomHandler } from "../types";
import routerHandler from "../utils/routeHandler";

interface Params {
  email: string;
  password: string;
}

function generateAdminToken(adminId: string) {
  const payload = {
    sub: adminId,
    role: "admin",
  };

  return jwt.sign(payload, process.env.VITE_JWT_SECRET || "", {
    expiresIn: "30d",
  });
}

const loginHandler: CustomHandler = async (prisma, params: Params) => {
  const admin = await prisma.admin.findUnique({
    where: {
      email: params.email,
    },
  });

  if (!admin || admin.password !== params.password) {
    return Response.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const token = generateAdminToken(admin.id);

  return { token };
};

const handler = async (request: Request, context: Context) => {
  // mock the context.params
  context.params = { queryPath: "login" };
  return new Response(JSON.stringify({ data: "Hello, login!" }), {
    status: 200,
  });
  // return await routerHandler(request, context, [
  //   {
  //     path: "login",
  //     handler: loginHandler,
  //   },
  // ]);
};

export const config: Config = {
  path: "/api/login",
};

export default handler;
