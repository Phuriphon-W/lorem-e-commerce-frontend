import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export async function decryptJwt(jwtToken: string | undefined) {
  if (!jwtToken) return null;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(jwtToken, secret);
    return payload;
  } catch (err) {
    return null;
  }
}

export async function getUserIdByToken():Promise<string> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("authToken");
  const jwt = await decryptJwt(authCookie?.value);
  return jwt?.id as string;
}
