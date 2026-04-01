import prisma from "@/lib/prisma";

export async function getAllGlCodings() {
  return await prisma.gLCoding.findMany({});
}

export async function getGlCodingById(id: number) {
  return await prisma.gLCoding.findUnique({
    where: { id },
  });
}

export async function createGlCoding(data: {
  accountId: number;
  description: string;
  amount: string;
  invoiceId?: number | null;
  departmentId?: number | null;
  memo?: string | null;
  transactionId?: string | null;
  type: "debit" | "credit";
}) {
  return await prisma.gLCoding.create({ data });
}

export async function updateGlCoding(
  id: number,
  data: {
    accountId?: number;
    description?: string;
    amount?: string;
    invoiceId?: number | null;
    departmentId?: number | null;
    memo?: string | null;
    transactionId?: string | null;
    type?: "debit" | "credit";
  }
) {
  return await prisma.gLCoding.update({
    where: { id },
    data,
  });
}

export async function deleteGlCoding(id: number) {
  return await prisma.gLCoding.delete({
    where: { id },
  });
}
