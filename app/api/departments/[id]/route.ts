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
import {
  handleApiError,
  handleBadRequest,
  handleNotFound,
  handleValidationError,
} from "@/lib/error";
import { noContent } from "@/lib/http";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = parsePositiveIntId(rawId);

    if (id === null) {
      return handleBadRequest("Invalid id parameter");
    }

    const department = await getDepartmentById(id);

    if (!department) {
      return handleNotFound("Department not found");
    }

    return NextResponse.json(parseSchemaOrThrow(department, departmentDetailSchema));
  } catch (error) {
    console.error("Error fetching department:", error);
    return handleApiError(error, "Failed to fetch department");
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = parsePositiveIntId(rawId);

    if (id === null) {
      return handleBadRequest("Invalid id parameter");
    }

    const body = await request.json();
    const validation = validateSchema(body, departmentUpdateSchema);

    if (!validation.success) {
      return handleValidationError(validation.errors);
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
      return handleBadRequest("Invalid id parameter");
    }

    await deleteDepartment(id);
    return noContent();
  } catch (error) {
    console.error("Error deleting department:", error);
    return handleApiError(error, "Failed to delete department");
  }
}
