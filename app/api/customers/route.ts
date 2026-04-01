import { NextResponse } from "next/server";
import { parseSchemaOrThrow, validateSchema } from "@/lib/validate";
import {
  customerDetailSchema,
  customerListSchema,
  customerSchema,
} from "@/schemas/customers";
import { getAllCustomers, createCustomer } from "@/lib/customer";
import { handleApiError, handleValidationError } from "@/lib/error";
import { createdJson } from "@/lib/http";

export async function GET() {
  try {
    const customer = await getAllCustomers();

    return NextResponse.json(parseSchemaOrThrow(customer, customerListSchema));
  } catch (error) {
    console.error("Error fetching customers:", error);
    return handleApiError(error, "Failed to fetch customers");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateSchema(body, customerSchema);

    if (!validation.success) {
      return handleValidationError(validation.errors);
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

    const response = parseSchemaOrThrow(customer, customerDetailSchema);
    return createdJson(request, response.id, response);
  } catch (error) {
    console.error("Error creating customer:", error);
    return handleApiError(error, "Failed to create customer");
  }
}
