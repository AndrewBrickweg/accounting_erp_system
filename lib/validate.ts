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
