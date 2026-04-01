import { Prisma } from "@prisma/client";
import { ZodType } from "zod";

export function validateSchema<T>(body: unknown, schema: ZodType<T>) {
  const result = schema.safeParse(body);
  if (!result.success) {
    const errorMessages = result.error.issues.map((err) => ({
      path: err.path.join("."),
      message: err.message,
    }));
    return {
      success: false,
      errors: errorMessages,
    };
  }
  return {
    success: true,
    data: result.data,
  };
}

export function parseSchemaOrThrow<T>(value: unknown, schema: ZodType<T>): T {
  const result = schema.safeParse(serializeSchemaValue(value));

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");
    throw new Error(`Response contract validation failed: ${details}`);
  }

  return result.data;
}

function serializeSchemaValue(value: unknown): unknown {
  if (value instanceof Prisma.Decimal) {
    return value.toString();
  }

  if (value instanceof Date || value === null || value === undefined) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => serializeSchemaValue(item));
  }

  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, serializeSchemaValue(item)])
    );
  }

  return value;
}

export function parsePositiveIntId(rawId: string): number | null {
  if (!/^\d+$/.test(rawId)) {
    return null;
  }

  const id = Number(rawId);
  if (!Number.isSafeInteger(id) || id <= 0) {
    return null;
  }

  return id;
}
