import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export function handleError(
  message: string,
  status: number = 500,
  extra?: Record<string, unknown>
) {
  return NextResponse.json({ error: message, ...extra }, { status });
}

export function handleApiError(
  error: unknown,
  fallbackMessage: string = "Internal Server Error"
) {
  if (error instanceof SyntaxError) {
    return handleError("Invalid JSON payload", 400);
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return handleError("Invalid request payload for database operation", 400);
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return handleError("Resource already exists", 409, {
          code: error.code,
          target: error.meta?.target,
        });
      case "P2003":
        return handleError("Invalid reference to related resource", 409, {
          code: error.code,
          field: error.meta?.field_name,
        });
      case "P2025":
        return handleError("Resource not found", 404, {
          code: error.code,
        });
      default:
        return handleError(fallbackMessage, 500, {
          code: error.code,
        });
    }
  }

  return handleError(fallbackMessage, 500);
}
