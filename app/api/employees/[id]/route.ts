import { NextResponse } from "next/server";
import { validateSchema } from "@/lib/validate";
import { employeeUpdateSchema } from "@/schemas/employees";
import {
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} from "@/lib/employee";
import { handleError } from "@/lib/error";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const employee = await getEmployeeById(params.id);

    if (!employee) {
      return handleError("Employee not found", 404);
    }

    return NextResponse.json(employee);
  } catch (error) {
    console.error("Error fetching employee:", error);
    return handleError("Internal Server Error", 500);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validation = validateSchema(body, employeeUpdateSchema);

    if (!validation.success) {
      return handleError("Validation failed", 400, {
        errors: validation.errors,
      });
    }

    const updatedEmployee = await updateEmployee(params.id, {
      firstName: validation.data?.firstName,
      lastName: validation.data?.lastName,
      email: validation.data?.email,
      role: validation.data?.role,
      departmentId: validation.data?.departmentId,
      managerId: validation.data?.managerId || null,
      isActive: validation.data?.isActive,
      terminatedAt: validation.data?.terminatedAt || null,
    });

    return NextResponse.json(updatedEmployee);
  } catch (error) {
    console.error("Error updating employee:", error);
    return handleError("Internal Server Error", 500);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const employee = await deleteEmployee(params.id);

    if (!employee) {
      return handleError("Employee not found", 404);
    }

    return NextResponse.json(employee);
  } catch (error) {
    console.error("Error deleting employee:", error);
    return handleError("Internal Server Error", 500);
  }
}
