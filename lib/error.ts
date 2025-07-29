import { NextResponse } from "next/server";

export function handleError(
  message: string,
  status: number = 500,
  extra?: Record<string, unknown>
) {
  return NextResponse.json({ error: message, ...extra }, { status });
}
