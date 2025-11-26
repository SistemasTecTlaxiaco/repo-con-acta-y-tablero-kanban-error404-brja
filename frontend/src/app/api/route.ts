import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const headers = Object.fromEntries(request.headers.entries());
    const ip =
      (headers["x-forwarded-for"] ||
        headers["x-real-ip"] ||
        "unknown") as string;
    const userAgent = headers["user-agent"] || "";

    const entry = {
      timestamp: new Date().toISOString(),
      ip,
      userAgent,
      ...body,
    };

    // Aquí solo mostramos en consola para debug (server logs)
    console.log("AUTH EVENT:", entry);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: String(error) },
      { status: 500 }
    );
  }
}
