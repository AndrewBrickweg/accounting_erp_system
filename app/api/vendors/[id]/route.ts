import { NextResponse } from "next/server";
import {
  parsePositiveIntId,
  parseSchemaOrThrow,
  validateSchema,
} from "@/lib/validate";
import { vendorDetailSchema, vendorUpdateSchema } from "@/schemas/vendors";
import { getVendorById, updateVendor, deleteVendor } from "@/lib/vendor";
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

    const vendor = await getVendorById(id);

    if (!vendor) {
      return handleNotFound("Vendor not found");
    }

    return NextResponse.json(parseSchemaOrThrow(vendor, vendorDetailSchema));
  } catch (error) {
    console.error("Error fetching vendor:", error);
    return handleApiError(error, "Failed to fetch vendor");
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
    const validation = validateSchema(body, vendorUpdateSchema);

    if (!validation.success) {
      return handleValidationError(validation.errors);
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
      return handleBadRequest("Invalid id parameter");
    }

    await deleteVendor(id);
    return noContent();
  } catch (error) {
    console.error("Error deleting vendor:", error);
    return handleApiError(error, "Failed to delete vendor");
  }
}
