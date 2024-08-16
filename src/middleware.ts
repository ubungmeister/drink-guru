import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Check if the user is authenticated and trying to access sign-in or sign-up
    if (token && (pathname === "/signin" || pathname === "/signup")) {
      return NextResponse.redirect(new URL("/", req.url)); // Redirect to the home page
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Ensure the user is authenticated if they have a token
    },
  },
);

export const config = {
  matcher: ["/drink-generator", "/"], // Paths to apply this middleware
};
