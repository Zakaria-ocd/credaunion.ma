import { NextRequest, NextResponse } from "next/server"

const SESSION_COOKIE_NAME = "admin_session"

function decodeSession(value: string) {
  try {
    const data = JSON.parse(Buffer.from(value, "base64").toString("utf-8"))
    if (data.exp && Date.now() < data.exp) {
      return data
    }
    return null
  } catch {
    return null
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect /admin/* routes (except /admin/login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value

    if (!sessionCookie || !decodeSession(sessionCookie)) {
      const loginUrl = new URL("/admin/login", request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
