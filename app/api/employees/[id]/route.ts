import { NextResponse } from "next/server";
import { validateSchema } from "@/lib/validate";
import { employeeSchema } from "@/schemas/employee";
import {
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} from "@/lib/employee";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const employee = await getEmployeeById(parseInt(params.id));

    if (!employee) {
      return new Response("Employee not found", { status: 404 });
    }

    return NextResponse.json(employee);
  } catch (error) {
    console.error("Error fetching employee:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validation = validateSchema(body, employeeSchema);

    if (!validation.success) {
      return new NextResponse(JSON.stringify({ errors: validation.errors }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const updatedEmployee = await updateEmployee(parseInt(params.id), {
      firstName: validation.data?.firstName,
      lastName: validation.data?.lastName,
      email: validation.data?.email,
      role: validation.data?.role,
      departmentId: validation.data?.departmentId,
    });

    return NextResponse.json(updatedEmployee);
  } catch (error) {
    console.error("Error updating employee:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const employee = await deleteEmployee(parseInt(params.id));

    if (!employee) {
      return new Response("Employee not found", { status: 404 });
    }

    return NextResponse.json(employee);
  } catch (error) {
    console.error("Error deleting employee:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
