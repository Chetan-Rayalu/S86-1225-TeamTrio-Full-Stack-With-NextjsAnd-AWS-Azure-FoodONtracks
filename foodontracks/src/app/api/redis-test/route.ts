import { NextResponse } from "next/server";
import redis from "@/lib/redis";
import withLogging from "@/lib/requestLogger";

export const dynamic = 'force-dynamic';

export const GET = withLogging(async () => {
  try {
    await redis.set("test-key", "Redis Connected!");
    const value = await redis.get("test-key");

    return NextResponse.json({
      success: true,
      message: value,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Redis connection failed",
      error: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
});
