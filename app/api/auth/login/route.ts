import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/db";
import { verifyPassword, setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const user = await getUserByEmail(email);
  if (!user) {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }

  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }

  await setSessionCookie({ userId: user.id, email: user.email, name: user.name });

  return NextResponse.json({ id: user.id, name: user.name, email: user.email });
}
