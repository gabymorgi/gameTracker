import type { Context } from "@netlify/functions";
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

export default async (request: Request, context: Context) => {
  return await routerHandler(request, context, [
    {
      path: "login",
      handler: loginHandler,
    },
  ]);
};
