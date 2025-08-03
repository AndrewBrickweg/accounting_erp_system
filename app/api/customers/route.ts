import { NextResponse } from "next/server";
import { validateSchema } from "@/lib/validate";
import { customerSchema } from "@/schemas/customers";
import { getAllCustomers, createCustomer } from "@/lib/customer";
import { handleError } from "@/lib/error";

export async function GET() {
  try {
    const customer = await getAllCustomers();

    return NextResponse.json(customer);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return handleError("Internal Server Error", 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateSchema(body, customerSchema);

    if (!validation.success) {
      return handleError("Validation failed", 400, {
        errors: validation.errors,
      });
    }

    const { firstName, lastName, companyName, email, phone, address } =
      validation.data!;
    const customer = await createCustomer({
      firstName,
      lastName,
      companyName,
      email,
      phone,
      address: address
        ? {
            street: address.street,
            city: address.city,
            state: address.state,
            zip: address.zip,
            country: address.country,
          }
        : undefined,
    });

    return NextResponse.json(customer);
  } catch (error) {
    console.error("Error creating customer:", error);
    return handleError("Internal Server Error", 500);
  }
}
