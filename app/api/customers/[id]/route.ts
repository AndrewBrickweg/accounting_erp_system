import { NextResponse } from "next/server";
import { parseSchemaOrThrow, validateSchema } from "@/lib/validate";
import {
  customerDetailSchema,
  customerUpdateSchema,
} from "@/schemas/customers";
import {
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "@/lib/customer";
import { handleApiError, handleError } from "@/lib/error";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const customer = await getCustomerById(id);

    if (!customer) {
      return handleError("Customer not found", 404);
    }

    return NextResponse.json(parseSchemaOrThrow(customer, customerDetailSchema));
  } catch (error) {
    console.error("Error fetching customer:", error);
    return handleApiError(error, "Failed to fetch customer");
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validation = validateSchema(body, customerUpdateSchema);

    if (!validation.success) {
      return handleError("Validation failed", 400, {
        errors: validation.errors,
      });
    }

    const updatedCustomer = await updateCustomer(id, validation.data!);

    return NextResponse.json(
      parseSchemaOrThrow(updatedCustomer, customerDetailSchema)
    );
  } catch (error) {
    console.error("Error updating customer:", error);
    return handleApiError(error, "Failed to update customer");
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deletedCustomer = await deleteCustomer(id);

    return NextResponse.json(
      parseSchemaOrThrow(deletedCustomer, customerDetailSchema)
    );
  } catch (error) {
    console.error("Error deleting customer:", error);
    return handleApiError(error, "Failed to delete customer");
  }
}
