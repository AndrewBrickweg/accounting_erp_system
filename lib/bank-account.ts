import prisma from "@/lib/prisma";

export async function getAllBankAccounts() {
  return await prisma.bankAccount.findMany();
}

export async function getBankAccountById(id: number) {
  return await prisma.bankAccount.findUnique({
    where: { id },
  });
}

export async function createBankAccount(data: {
  name: string;
  accountNumber: string;
  bankName: string;
  balance: number;
}) {
  return await prisma.bankAccount.create({ data });
}

export async function updateBankAccount(
  id: number,
  data: {
    name?: string;
    accountNumber?: string;
    bankName?: string;
    balance?: number;
  }
) {
  return await prisma.bankAccount.update({
    where: { id },
    data,
  });
}

export async function deleteBankAccount(id: number) {
  return await prisma.bankAccount.delete({
    where: { id },
  });
}
