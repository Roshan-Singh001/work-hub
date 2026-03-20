import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function proxy(request) {
    const token = request.cookies.get("token")?.value;
    const { pathname } = request.nextUrl;

    console.log("Proxy middleware: token =", token, ", pathname =", pathname);

    if (!token) {
        if (pathname.startsWith("/admin") ||
            pathname.startsWith("/orgs") ||
            pathname.startsWith("/freelancer") ||
            pathname.startsWith("/client")) {
            return NextResponse.redirect(new URL("/auth/login", request.url));
        }
    }

    try {
        const {payload} = await jwtVerify(token, secret);
        const role = payload.role;

        if (pathname.startsWith("/admin") && role !== "Admin") {
            return NextResponse.redirect(new URL("/", request.url));
        }

        if (pathname.startsWith("/orgs/admin") && role !== "ORG_Owner") {
            return NextResponse.redirect(new URL("/", request.url));
        }

        if (pathname.startsWith("/orgs/member") && role !== "ORG_Member") {
            return NextResponse.redirect(new URL("/", request.url));
        }

        if (pathname.startsWith("/freelancer") && role !== "Freelancer") {
            return NextResponse.redirect(new URL("/", request.url));
        }

        if (pathname.startsWith("/client") && role !== "Client") {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }
    catch(err){
        console.error("Token verification failed:", err);
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/admin/:path*",
        "/orgs/:path*",
        "/freelancer/:path*",
        "/client/:path*",
    ],
};