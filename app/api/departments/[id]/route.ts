import { NextResponse } from "next/server";
import { validateSchema } from "@/lib/validate";
import { departmentSchema } from "@/schemas/departments";
import {
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
} from "@/lib/department";
import { handleError } from "@/lib/error";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const department = await getDepartmentById(parseInt(params.id));

    if (!department) {
      return handleError("Department not found", 404);
    }

    return NextResponse.json(department);
  } catch (error) {
    console.error("Error fetching department:", error);
    return handleError("Failed to fetch department", 500);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validation = validateSchema(body, departmentSchema);

    if (!validation.success) {
      return handleError("Validation failed", 400, {
        errors: validation.errors,
      });
    }

    const updatedDepartment = await updateDepartment(parseInt(params.id), body);

    if (!updatedDepartment) {
      return handleError("Failed to update department", 500);
    }

    return NextResponse.json(updatedDepartment);
  } catch (error) {
    console.error("Error updating department:", error);
    return handleError("Failed to update department", 500);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const deletedDepartment = await deleteDepartment(parseInt(params.id));

    if (!deletedDepartment) {
      return handleError("Failed to delete department", 500);
    }

    return NextResponse.json({ message: "Department deleted successfully" });
  } catch (error) {
    console.error("Error deleting department:", error);
    return handleError("Failed to delete department", 500);
  }
}
