import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    if (req.nextUrl.pathname.includes("/api/getUpdates")) {
        const basicAuth = req.headers.get("authorization");

        if (basicAuth) {
            const auth = basicAuth.split(" ")[1];
            const [user, pwd] = atob(auth).toString().split(":");

            if (
                user === process.env.API_USERNAME &&
                pwd === process.env.API_PASSWORD
            ) {
                return NextResponse.next();
            }
        }

        return new Response("Auth required", {
            status: 401,
            headers: {
                "WWW-Authenticate": 'Basic realm="Secure Area"',
            },
        });
    }
}
