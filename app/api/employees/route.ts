import { NextResponse } from "next/server";
import { validateSchema } from "@/lib/validate";
import { employeeSchema } from "@/schemas/employee";
import { getAllEmployees, createEmployee } from "@/lib/employee";
import { handleError } from "@/lib/error";

export async function GET() {
  try {
    const employees = await getAllEmployees();

    return NextResponse.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    return handleError("Internal Server Error", 500);
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
    const { firstName, lastName, email, role, departmentId } = validation.data!;
    const employee = await createEmployee({
      firstName,
      lastName,
      email,
      role,
      departmentId,
    });

    return NextResponse.json(employee);
  } catch (error) {
    console.error("Error creating employee:", error);
    return handleError("Internal Server Error", 500);
  }
}
