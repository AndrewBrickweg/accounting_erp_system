import { NextResponse } from "next/server.js";
import { Prisma } from "@prisma/client";

type ApiErrorCode =
  | "bad_request"
  | "conflict"
  | "foreign_key_violation"
  | "internal_error"
  | "invalid_json"
  | "not_found"
  | "validation_error";

export function handleError(
  code: ApiErrorCode,
  message: string,
  status: number = 500,
  details?: unknown
) {
  return NextResponse.json(
    {
      error: {
        code,
        message,
        ...(details === undefined ? {} : { details }),
      },
    },
    { status }
  );
}

export function handleBadRequest(message: string, details?: unknown) {
  return handleError("bad_request", message, 400, details);
}

export function handleNotFound(message: string) {
  return handleError("not_found", message, 404);
}

export function handleValidationError(
  issues: Array<{ path: string; message: string }> | undefined
) {
  return handleError("validation_error", "Validation failed", 400, {
    issues: issues ?? [],
  });
}

export function handleApiError(
  error: unknown,
  fallbackMessage: string = "Internal Server Error"
) {
  if (error instanceof SyntaxError) {
    return handleError("invalid_json", "Invalid JSON payload", 400);
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return handleBadRequest("Invalid request payload for database operation");
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return handleError("conflict", "Resource already exists", 409, {
          target: error.meta?.target,
        });
      case "P2003":
        return handleError(
          "foreign_key_violation",
          "Invalid reference to related resource",
          409,
          {
          field: error.meta?.field_name,
          }
        );
      case "P2025":
        return handleNotFound("Resource not found");
      default:
        return handleError("internal_error", fallbackMessage, 500, {
          prismaCode: error.code,
        });
    }
  }

  return handleError("internal_error", fallbackMessage, 500);
}
