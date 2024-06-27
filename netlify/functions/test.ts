export default async (request: Request) => {
  console.log("handling", request.url);
  return Response.json({ msg: "Hello, test!" }, { status: 200 });
};
