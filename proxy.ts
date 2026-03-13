import { decryptJwt } from "@/utils/jwt";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { publicRoutes } from "./shared/publicRouteList";

export default async function proxy(request: NextRequest) {
    const path = request.nextUrl.pathname
    const isPublicRoutes = publicRoutes.includes(path)

    const cookie = (await cookies()).get("authToken")?.value
    const authToken = await decryptJwt(cookie)
    
    if (!isPublicRoutes && !authToken?.id) {
        return NextResponse.redirect(new URL('/signin', request.nextUrl))
    }

    return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}