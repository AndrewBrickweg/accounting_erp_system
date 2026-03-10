import { NextResponse } from "next/server";
import {
  parsePositiveIntId,
  parseSchemaOrThrow,
  validateSchema,
} from "@/lib/validate";
import { vendorDetailSchema, vendorUpdateSchema } from "@/schemas/vendors";
import { getVendorById, updateVendor, deleteVendor } from "@/lib/vendor";
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

    const vendor = await getVendorById(id);

    if (!vendor) {
      return handleError("Vendor not found", 404);
    }

    return NextResponse.json(parseSchemaOrThrow(vendor, vendorDetailSchema));
  } catch (error) {
    console.error("Error fetching vendor:", error);
    return handleApiError(error, "Failed to fetch vendor");
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
    const validation = validateSchema(body, vendorUpdateSchema);

    if (!validation.success) {
      return handleError("Validation failed", 400, {
        errors: validation.errors,
      });
    }

    const updatedVendor = await updateVendor(id, validation.data!);
    return NextResponse.json(parseSchemaOrThrow(updatedVendor, vendorDetailSchema));
  } catch (error) {
    console.error("Error updating vendor:", error);
    return handleApiError(error, "Failed to update vendor");
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

    const deletedVendor = await deleteVendor(id);
    return NextResponse.json(parseSchemaOrThrow(deletedVendor, vendorDetailSchema));
  } catch (error) {
    console.error("Error deleting vendor:", error);
    return handleApiError(error, "Failed to delete vendor");
  }
}
