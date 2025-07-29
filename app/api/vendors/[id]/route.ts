import { NextResponse } from "next/server";
import { validateSchema } from "@/lib/validate";
import { vendorSchema } from "@/schemas/vendors";
import { getVendorById, updateVendor, deleteVendor } from "@/lib/vendor";
import { handleError } from "@/lib/error";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const vendor = await getVendorById(parseInt(params.id));

    if (!vendor) {
      return handleError("Vendor not found", 404);
    }

    return NextResponse.json(vendor);
  } catch (error) {
    console.error("Error fetching vendor:", error);
    return handleError("Internal Server Error", 500);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validation = validateSchema(body, vendorSchema);

    if (!validation.success) {
      return handleError("Validation failed", 400, {
        errors: validation.errors,
      });
    }

    const updatedVendor = await updateVendor(parseInt(params.id), {
      name: validation.data?.name,
      contactName: validation.data?.contactName,
      email: validation.data?.email,
      phone: validation.data?.phone,
      address: validation.data?.address,
    });
    return NextResponse.json(updatedVendor);
  } catch (error) {
    console.error("Error updating vendor:", error);
    return handleError("Internal Server Error", 500);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const deletedVendor = await deleteVendor(parseInt(params.id));
    return NextResponse.json(deletedVendor);
  } catch (error) {
    console.error("Error deleting vendor:", error);
    return handleError("Internal Server Error", 500);
  }
}
