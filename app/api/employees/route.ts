import { NextResponse } from "next/server";
import { parseSchemaOrThrow, validateSchema } from "@/lib/validate";
import {
  employeeDetailSchema,
  employeeListSchema,
  employeeSchema,
} from "@/schemas/employees";
import { getAllEmployees, createEmployee } from "@/lib/employee";
import { handleApiError, handleError } from "@/lib/error";

export async function GET() {
  try {
    const employees = await getAllEmployees();

    return NextResponse.json(parseSchemaOrThrow(employees, employeeListSchema));
  } catch (error) {
    console.error("Error fetching employees:", error);
    return handleApiError(error, "Failed to fetch employees");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateSchema(body, employeeSchema);

    if (!validation.success) {
      return handleError("Validation failed", 400, {
        errors: validation.errors,
      });
    }
    const {
      firstName,
      lastName,
      email,
      role,
      departmentId,
      isActive,
      terminatedAt,
    } = validation.data!;
    const employee = await createEmployee({
      firstName,
      lastName,
      email,
      role,
      departmentId,
      managerId: validation.data?.managerId ?? null,
      isActive,
      terminatedAt,
    });

    return NextResponse.json(parseSchemaOrThrow(employee, employeeDetailSchema));
  } catch (error) {
    console.error("Error creating employee:", error);
    return handleApiError(error, "Failed to create employee");
  }
}
