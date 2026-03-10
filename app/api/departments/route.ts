import { NextResponse } from "next/server";
import { parseSchemaOrThrow, validateSchema } from "@/lib/validate";
import {
  departmentDetailSchema,
  departmentListSchema,
  departmentSchema,
} from "@/schemas/departments";
import { getAllDepartments, createDepartment } from "@/lib/department";
import { handleApiError, handleError } from "@/lib/error";

export async function GET() {
  try {
    const departments = await getAllDepartments();
    return NextResponse.json(parseSchemaOrThrow(departments, departmentListSchema));
  } catch (error) {
    console.error("Error fetching departments:", error);
    return handleApiError(error, "Failed to fetch departments");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateSchema(body, departmentSchema);

    if (!validation.success) {
      return handleError("Validation failed", 400, {
        errors: validation.errors,
      });
    }

    const { name, managerId, code } = validation.data!;
    const department = await createDepartment({
      name,
      managerId,
      code,
    });

    return NextResponse.json(
      parseSchemaOrThrow(department, departmentDetailSchema),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating department:", error);
    return handleApiError(error, "Failed to create department");
  }
}
