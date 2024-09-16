import type { Context } from "@netlify/functions";
import jwt from "jsonwebtoken";
import { CustomHandler } from "../types";
import routerHandler from "../utils/routeHandler";
import { CustomError } from "../utils/error";

function generateAdminToken(adminId: string) {
  const payload = {
    sub: adminId,
    role: "admin",
  };

  return jwt.sign(payload, process.env.VITE_JWT_SECRET || "", {
    expiresIn: "30d",
  });
}

const loginHandler: CustomHandler<"login"> = async (prisma, params) => {
  const admin = await prisma.admin.findUnique({
    where: {
      email: params.email,
    },
  });

  if (!admin || admin.password !== params.password) {
    throw new CustomError("Invalid credentials", 401);
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
