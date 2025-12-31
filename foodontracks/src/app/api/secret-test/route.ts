import { NextResponse } from "next/server";
import { getSecrets } from "../../lib/secrets";

export async function GET() {
  try {
    const secrets = await getSecrets();

    return NextResponse.json({ keys: Object.keys(secrets) });
  } catch (err: any) {
    console.error("/api/secret-test error:", err);
    const msg = err?.message || "Unknown error";
    const status = msg.includes("SECRET_ARN") ? 400 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
