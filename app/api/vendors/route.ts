import { NextResponse } from "next/server";
import { validateSchema } from "@/lib/validate";
import { vendorSchema } from "@/schemas/vendors";
import { getAllVendors, createVendor } from "@/lib/vendor";
import { handleError } from "@/lib/errors";

export async function GET() {
  try {
    const vendors = await getAllVendors();
    return NextResponse.json(vendors);
  } catch (error) {
    console.error("Error fetching vendors:", error);
    return handleError("Internal Server Error", 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateSchema(body, vendorSchema);

    if (!validation.success) {
      return handleError("Validation failed", 400, {
        errors: validation.errors,
      });
    }

    const { name, contactName, email, phone, address } = validation.data!;
    const vendor = await createVendor({
      name,
      contactName,
      email,
      phone,
      address,
    });

    return NextResponse.json(vendor);
  } catch (error) {
    console.error("Error creating vendor:", error);
    return handleError("Internal Server Error", 500);
  }
}
