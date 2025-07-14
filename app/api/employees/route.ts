// src/app/api/employees/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "../../../app/generated/prisma";
const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const employee = await prisma.employee.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        role: body.role,
        departmentId: body.departmentId,
      },
    });

    return NextResponse.json(employee);
  } catch (error) {
    console.error("Error creating employee:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      include: { department: true }, // optional, to include department info
    });

    return NextResponse.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
