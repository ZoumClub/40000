import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protect dealer routes except login
  if (req.nextUrl.pathname.startsWith("/dealer") && 
      !req.nextUrl.pathname.startsWith("/dealer/login")) {
    if (!session) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = "/dealer/login";
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Redirect to dealer dashboard if already logged in
  if (req.nextUrl.pathname === "/dealer/login" && session) {
    return NextResponse.redirect(new URL("/dealer", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/dealer/:path*"],
};