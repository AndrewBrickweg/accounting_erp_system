import prisma from "@/lib/prisma";

export async function getAllGlCodings() {
  return await prisma.glcoding.findMany({});
}

export async function getGlCodingById(id: number) {
  return await prisma.glcoding.findUnique({
    where: { id },
  });
}

export async function createGlCoding(data: {
  accountId: number;
  description: string;
  amount: number;
  invoiceId?: number | null;
  departmentId?: number | null;
  memo?: string | null;
  transactionId?: string | null;
  type: "debit" | "credit";
}) {
  return await prisma.glcoding.create({ data });
}

export async function updateGlCoding(
  id: number,
  data: {
    accountId?: number;
    description?: string;
    amount?: number;
    invoiceId?: number | null;
    departmentId?: number | null;
    memo?: string | null;
    transactionId?: string | null;
    type?: "debit" | "credit";
  }
) {
  return await prisma.glcoding.update({
    where: { id },
    data,
  });
}

export async function deleteGlCoding(id: number) {
  return await prisma.glcoding.delete({
    where: { id },
  });
}
