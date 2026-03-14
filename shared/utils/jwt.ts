import { jwtVerify } from "jose";

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
