import jwt from "jsonwebtoken";

function isAuthorized(headers?: Headers) {
  const authorization = headers?.get("authorization");
  if (!headers || !authorization) {
    return false;
  }
  const token = authorization;

  try {
    const payload: jwt.JwtPayload = jwt.verify(
      token,
      process.env.VITE_JWT_SECRET || "",
    ) as jwt.JwtPayload;

    if (payload.role !== "admin") {
      return false;
    }

    return true;
  } catch (err) {
    return false;
  }
}

export default isAuthorized;
