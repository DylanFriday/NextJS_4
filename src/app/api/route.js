import { createOptionsResponse, getCorsHeaders } from "@/lib/cors";
import { NextResponse } from "next/server";

export async function OPTIONS(req) {
  return createOptionsResponse(req);
}

export async function GET(req) {
  return NextResponse.json({ ok: true }, { headers: getCorsHeaders(req) });
}
