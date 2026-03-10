import { NextResponse } from "next/server";
import { parseSchemaOrThrow, validateSchema } from "@/lib/validate";
import {
  employeeDetailSchema,
  employeeUpdateSchema,
} from "@/schemas/employees";
import {
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} from "@/lib/employee";
import { handleApiError, handleError } from "@/lib/error";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const employee = await getEmployeeById(id);

    if (!employee) {
      return handleError("Employee not found", 404);
    }

    return NextResponse.json(parseSchemaOrThrow(employee, employeeDetailSchema));
  } catch (error) {
    console.error("Error fetching employee:", error);
    return handleApiError(error, "Failed to fetch employee");
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validation = validateSchema(body, employeeUpdateSchema);

    if (!validation.success) {
      return handleError("Validation failed", 400, {
        errors: validation.errors,
      });
    }

    const updatedEmployee = await updateEmployee(id, validation.data!);

    return NextResponse.json(
      parseSchemaOrThrow(updatedEmployee, employeeDetailSchema)
    );
  } catch (error) {
    console.error("Error updating employee:", error);
    return handleApiError(error, "Failed to update employee");
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const employee = await deleteEmployee(id);

    if (!employee) {
      return handleError("Employee not found", 404);
    }

    return NextResponse.json(parseSchemaOrThrow(employee, employeeDetailSchema));
  } catch (error) {
    console.error("Error deleting employee:", error);
    return handleApiError(error, "Failed to delete employee");
  }
}
