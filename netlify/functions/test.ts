import { Context } from "@netlify/functions";

export default async (request: Request, context: Context) => {
  console.log("handling", request, context);
  return Response.json({ msg: "Hello, test!" }, { status: 200 });
};
