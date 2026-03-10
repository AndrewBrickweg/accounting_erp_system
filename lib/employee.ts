import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function getAllEmployees() {
  return await prisma.employee.findMany({
    include: { department: true, manager: true },
  });
}

export async function getEmployeeById(id: string) {
  return await prisma.employee.findUnique({
    where: { id },
    include: { department: true, manager: true },
  });
}

export async function createEmployee(data: {
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  departmentId: number;
  managerId?: string | null;
  isActive?: boolean;
  terminatedAt?: Date | null;
}) {
  return await prisma.employee.create({
    data,
    include: { department: true, manager: true },
  });
}

export async function updateEmployee(
  id: string,
  data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: Role;
    departmentId?: number;
    managerId?: string | null;
    isActive?: boolean;
    terminatedAt?: Date | null;
  }
) {
  return await prisma.employee.update({
    where: { id },
    data,
    include: { department: true, manager: true },
  });
}

export async function deleteEmployee(id: string) {
  return await prisma.employee.delete({
    where: { id },
    include: { department: true, manager: true },
  });
}
