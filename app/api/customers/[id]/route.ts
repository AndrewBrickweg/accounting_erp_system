import { NextResponse } from "next/server";
import { validateSchema } from "@/lib/validate";
import { customerSchema } from "@/schemas/customers";
import {
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "@/lib/customer";
import { handleError } from "@/lib/error";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const customer = await getCustomerById(parseInt(params.id));

    if (!customer) {
      return handleError("Customer not found", 404);
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.error("Error fetching customer:", error);
    return handleError("Internal Server Error", 500);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validation = validateSchema(body, customerSchema);

    if (!validation.success) {
      return handleError("Validation failed", 400, {
        errors: validation.errors,
      });
    }

    const updatedCustomer = await updateCustomer(parseInt(params.id), {
      firstName: validation.data?.firstName,
      lastName: validation.data?.lastName,
      companyName: validation.data?.companyName,
      email: validation.data?.email,
      phone: validation.data?.phone,
      address: validation.data?.address
        ? {
            street: validation.data.address.street,
            city: validation.data.address.city,
            state: validation.data.address.state,
            zip: validation.data.address.zip,
            country: validation.data.address.country,
          }
        : undefined,
    });

    return NextResponse.json(updatedCustomer);
  } catch (error) {
    console.error("Error updating customer:", error);
    return handleError("Internal Server Error", 500);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const deletedCustomer = await deleteCustomer(parseInt(params.id));

    return NextResponse.json(deletedCustomer);
  } catch (error) {
    console.error("Error deleting customer:", error);
    return handleError("Internal Server Error", 500);
  }
}
