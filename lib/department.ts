import prisma from "@/lib/prisma";

export async function getAllDepartments() {
  return await prisma.department.findMany();
}

export async function getDepartmentById(id: number) {
  return await prisma.department.findUnique({
    where: { id },
  });
}

export async function createDepartment(data: {
  name: string;
  managerId?: number | null;
  code: string;
}) {
  return await prisma.department.create({ data });
}

export async function updateDepartment(
  id: number,
  data: {
    name: string;
    managerId?: number | null;
    code: string;
  }
) {
  return await prisma.department.update({
    where: { id },
    data,
  });
}

export async function deleteDepartment(id: number) {
  return await prisma.department.delete({
    where: { id },
  });
}
