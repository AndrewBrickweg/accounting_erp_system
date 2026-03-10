import { prisma } from "@/lib/prisma";

export async function getAllBankTransactions() {
  return await prisma.bankTransaction.findMany({
    include: { bankAccount: true },
  });
}

export async function getBankTransactionById(id: number) {
  return await prisma.bankTransaction.findUnique({
    where: { id },
    include: { bankAccount: true },
  });
}

export async function createBankTransaction(data: {
  bankAccountId: number;
  description: string;
  amount: number;
  createdAt?: Date;
  date?: Date;
  reference?: string;
}) {
  return await prisma.bankTransaction.create({
    data,
    include: { bankAccount: true },
  });
}

export async function updateBankTransaction(
  id: number,
  data: {
    bankAccountId?: number;
    description?: string;
    amount?: number;
    createdAt?: Date;
    date?: Date;
    reference?: string;
  }
) {
  return await prisma.bankTransaction.update({
    where: { id },
    data,
    include: { bankAccount: true },
  });
}

export async function deleteBankTransaction(id: number) {
  return await prisma.bankTransaction.delete({
    where: { id },
    include: { bankAccount: true },
  });
}
