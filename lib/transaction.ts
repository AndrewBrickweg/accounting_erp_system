import prisma from "@/lib/prisma";

export async function getAllTransactions() {
  return await prisma.transaction.findMany();
}

export async function getTransactionById(id: string) {
  return await prisma.transaction.findUnique({
    where: { id },
  });
}

export async function createTransaction(data: {
  date?: Date;
  memo?: string;
  referenceNumber?: string;
  type: string;
  source?: string;
  status?: string;
  isPosted?: boolean;
  postedAt?: Date | null;
}) {
  return await prisma.transaction.create({ data });
}

export async function updateTransaction(
  id: string,
  data: {
    date?: Date;
    memo?: string;
    referenceNumber?: string;
    type?: string;
    source?: string;
    status?: string;
    isPosted?: boolean;
    postedAt?: Date | null;
  }
) {
  return await prisma.transaction.update({
    where: { id },
    data,
  });
}

export async function deleteTransaction(id: string) {
  return await prisma.transaction.delete({
    where: { id },
  });
}
