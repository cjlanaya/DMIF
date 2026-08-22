import { NextRequest, NextResponse } from "next/server";
import { createUser, getUserByEmail } from "@/lib/db";
import { hashPassword, setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!name || !email || !password) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "password_short" }, { status: 400 });
  }

  const existing = await getUserByEmail(email);
  if (existing) {
    return NextResponse.json({ error: "email_taken" }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const user = await createUser(name, email, passwordHash);

  await setSessionCookie({ userId: user.id, email: user.email, name: user.name });

  return NextResponse.json({ id: user.id, name: user.name, email: user.email });
}
