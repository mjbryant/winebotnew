import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const pino = require("pino");
const logger = pino();

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const path = request.nextUrl.pathname;

  // Only log API requests for now
  if (path.startsWith("/api/")) {
    logger.info({
      status: response.status,
      method: request.method,
      path,
    });
  }
  return response;
}
