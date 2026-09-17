import { NextResponse } from "next/server";
import {
  SESSION_COOKIE_NAME,
  verifyPassword,
  getExpectedSessionToken,
} from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!process.env.APP_PASSWORD) {
      return NextResponse.json(
        { error: "Server authentication is not configured. Set APP_PASSWORD in environment." },
        { status: 500 }
      );
    }

    if (!password || !verifyPassword(password)) {
      return NextResponse.json(
        { error: "Incorrect password. Please try again." },
        { status: 401 }
      );
    }

    const token = await getExpectedSessionToken();
    if (!token) {
      return NextResponse.json(
        { error: "Failed to create session." },
        { status: 500 }
      );
    }

    const response = NextResponse.json({ success: true });

    // 30 days session
    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Authentication failed." },
      { status: 500 }
    );
  }
}
