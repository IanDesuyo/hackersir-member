import { env } from "@/lib/env.mjs";
import { NextResponse } from "next/server";

/**
 * Handle the redirect from FCU NID
 */
const handler = async (req: Request) => {
  if (req.method == "POST" && req.headers.get("origin") == "https://opendata.fcu.edu.tw") {
    const url = new URL(req.url);

    const formData = await req.formData();
    const user_code = formData.get("user_code");

    if (user_code) {
      const redirectUrl = new URL("/api/auth/callback/fcu-nid", env.NEXTAUTH_URL);
      redirectUrl.searchParams.set("code", user_code.toString());

      return NextResponse.redirect(redirectUrl, 302);
    }
  }

  return NextResponse.next();
};

export { handler as GET, handler as POST };
