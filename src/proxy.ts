import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware(req) {
        return NextResponse.next()
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
        pages: {
            signIn: "/login",
        },
    }
)

export const config = {
    matcher: [
        /*
         * Match authenticated routes:
         * - /dashboard
         * - /profile
         * - /catalog
         * - /course/:path*
         * - /checkout
         */
        "/dashboard/:path*",
        "/profile/:path*",
        "/catalog/:path*",
        "/course/:path*",
        "/checkout/:path*",
    ],
}
