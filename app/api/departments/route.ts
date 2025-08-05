import { NextResponse } from "next/server";
import { validateSchema } from "@/lib/validate";
import { departmentSchema } from "@/schemas/departments";
import { getAllDepartments, createDepartment } from "@/lib/department";
import { handleError } from "@/lib/error";

export async function GET() {
  try {
    const departments = await getAllDepartments();
    return NextResponse.json(departments);
  } catch (error) {
    console.error("Error fetching departments:", error);
    return handleError("Internal Server Error", 500);
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

    return NextResponse.json(department, { status: 201 });
  } catch (error) {
    console.error("Error creating department:", error);
    return handleError("Internal Server Error", 500);
  }
}
