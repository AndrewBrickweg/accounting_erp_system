import prisma from "@/lib/prisma";

export async function getAllEmployees() {
  return await prisma.employee.findMany({
    include: { department: true },
  });
}

export async function getEmployeeById(id: number) {
  return await prisma.employee.findUnique({
    where: { id },
    include: { department: true },
  });
}

export async function createEmployee(data: {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  departmentId: number;
}) {
  return await prisma.employee.create({ data });
}

export async function updateEmployee(
  id: number,
  data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
    departmentId?: number;
  }
) {
  return await prisma.employee.update({
    where: { id },
    data,
    include: { department: true },
  });
}

export async function deleteEmployee(id: number) {
  return await prisma.employee.delete({
    where: { id },
    include: { department: true },
  });
}
