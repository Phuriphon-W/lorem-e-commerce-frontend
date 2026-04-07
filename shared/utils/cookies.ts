import { cookies } from "next/headers";

export function parseAndSetCookies(cookieStore: any, header: string[]) {
  header.forEach(cookieStr => {
    const parts = cookieStr.split(';').map(p => p.trim());
    const [nameValue, ...options] = parts;
    const [name, value] = nameValue.split('=');

    const config: any = { path: '/' };

    options.forEach(opt => {
      const [key, val] = opt.split('=');
      const lowerKey = key.toLowerCase();
      
      if (lowerKey === 'path') config.path = val;
      if (lowerKey === 'httponly') config.httpOnly = true;
      if (lowerKey === 'secure') config.secure = true;
      if (lowerKey === 'max-age') config.maxAge = parseInt(val);
      if (lowerKey === 'samesite') config.sameSite = val.toLowerCase();
    });

    cookieStore.set(name, value, config);
  });
}

export async function getServerCookies() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("authToken")
  const cookieString = authCookie ? `${authCookie.name}=${authCookie.value}` : undefined;
  return cookieString;
}