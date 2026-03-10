import { NextResponse } from "next/server";
import {
  parsePositiveIntId,
  parseSchemaOrThrow,
  validateSchema,
} from "@/lib/validate";
import {
  departmentDetailSchema,
  departmentUpdateSchema,
} from "@/schemas/departments";
import {
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
} from "@/lib/department";
import { handleApiError, handleError } from "@/lib/error";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = parsePositiveIntId(rawId);

    if (id === null) {
      return handleError("Invalid id parameter", 400);
    }

    const department = await getDepartmentById(id);

    if (!department) {
      return handleError("Department not found", 404);
    }

    return NextResponse.json(parseSchemaOrThrow(department, departmentDetailSchema));
  } catch (error) {
    console.error("Error fetching department:", error);
    return handleApiError(error, "Failed to fetch department");
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = parsePositiveIntId(rawId);

    if (id === null) {
      return handleError("Invalid id parameter", 400);
    }

    const body = await request.json();
    const validation = validateSchema(body, departmentUpdateSchema);

    if (!validation.success) {
      return handleError("Validation failed", 400, {
        errors: validation.errors,
      });
    }

    const updatedDepartment = await updateDepartment(id, validation.data!);

    return NextResponse.json(
      parseSchemaOrThrow(updatedDepartment, departmentDetailSchema)
    );
  } catch (error) {
    console.error("Error updating department:", error);
    return handleApiError(error, "Failed to update department");
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = parsePositiveIntId(rawId);

    if (id === null) {
      return handleError("Invalid id parameter", 400);
    }

    await deleteDepartment(id);

    return NextResponse.json({ message: "Department deleted successfully" });
  } catch (error) {
    console.error("Error deleting department:", error);
    return handleApiError(error, "Failed to delete department");
  }
}
