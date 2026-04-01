import { NextResponse } from "next/server";
import { parseSchemaOrThrow, validateSchema } from "@/lib/validate";
import { vendorDetailSchema, vendorListSchema, vendorSchema } from "@/schemas/vendors";
import { getAllVendors, createVendor } from "@/lib/vendor";
import { handleApiError, handleValidationError } from "@/lib/error";
import { createdJson } from "@/lib/http";

export async function GET() {
  try {
    const vendors = await getAllVendors();
    return NextResponse.json(parseSchemaOrThrow(vendors, vendorListSchema));
  } catch (error) {
    console.error("Error fetching vendors:", error);
    return handleApiError(error, "Failed to fetch vendors");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateSchema(body, vendorSchema);

    if (!validation.success) {
      return handleValidationError(validation.errors);
    }

    const { name, contactName, email, phone, address } = validation.data!;
    const vendor = await createVendor({
      name,
      contactName,
      email,
      phone,
      address,
    });

    const response = parseSchemaOrThrow(vendor, vendorDetailSchema);
    return createdJson(request, response.id, response);
  } catch (error) {
    console.error("Error creating vendor:", error);
    return handleApiError(error, "Failed to create vendor");
  }
}
