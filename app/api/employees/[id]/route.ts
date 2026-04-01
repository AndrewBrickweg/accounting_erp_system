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
import {
  handleApiError,
  handleNotFound,
  handleValidationError,
} from "@/lib/error";
import { noContent } from "@/lib/http";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const employee = await getEmployeeById(id);

    if (!employee) {
      return handleNotFound("Employee not found");
    }

    return NextResponse.json(parseSchemaOrThrow(employee, employeeDetailSchema));
  } catch (error) {
    console.error("Error fetching employee:", error);
    return handleApiError(error, "Failed to fetch employee");
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validation = validateSchema(body, employeeUpdateSchema);

    if (!validation.success) {
      return handleValidationError(validation.errors);
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
    await deleteEmployee(id);
    return noContent();
  } catch (error) {
    console.error("Error deleting employee:", error);
    return handleApiError(error, "Failed to delete employee");
  }
}
