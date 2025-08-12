import prisma from "@/lib/prisma";

export async function getAllBankReconciliations() {
  return await prisma.bankReconciliation.findMany({
    include: { bankAccount: true, transactions: true },
  });
}

export async function getBankReconciliationById(id: number) {
  return await prisma.bankReconciliation.findUnique({
    where: { id },
    include: { bankAccount: true, transactions: true },
  });
}

export async function createBankReconciliation(data: {
  bankAccountId: number;
  statementStartDate: Date;
  statementEndDate: Date;
  status: string;
  notes?: string | null;
  completedById?: string | null;
}) {
  return await prisma.bankReconciliation.create({ data });
}

export async function updateBankReconciliation(
  id: number,
  data: {
    bankAccountId?: number;
    statementStartDate?: Date;
    statementEndDate?: Date;
    status?: string;
    notes?: string | null;
    completedById?: string | null;
  }
) {
  return await prisma.bankReconciliation.update({
    where: { id },
    data,
    include: { bankAccount: true, transactions: true },
  });
}

export async function deleteBankReconciliation(id: number) {
  return await prisma.bankReconciliation.delete({
    where: { id },
    include: { bankAccount: true, transactions: true },
  });
}
