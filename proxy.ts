import { decryptJwt } from "@/shared/utils/jwt";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { publicRoutes } from "./shared/routeList";

export default async function proxy(request: NextRequest) {
    const path = request.nextUrl.pathname
    const isPublicRoutes = publicRoutes.includes(path)

    const cookie = (await cookies()).get("authToken")?.value
    const authToken = await decryptJwt(cookie)
    
    if (!isPublicRoutes && !authToken?.id) {
        return NextResponse.redirect(new URL('/signin', request.nextUrl))
    }

    if (authToken?.id) {
        const isAdmin = !!authToken.isAdmin
        const isBackofficeRoutes = path.startsWith('/backoffice')

        if (isAdmin && !isBackofficeRoutes) {
            return NextResponse.redirect(new URL('/backoffice', request.nextUrl))
        }

        if (!isAdmin && isBackofficeRoutes) {
            return NextResponse.redirect(new URL('/', request.nextUrl))
        }
    }

    return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)$).*)'],
}