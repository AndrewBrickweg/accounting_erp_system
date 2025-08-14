import prisma from "@/lib/prisma";

export async function getAllReconciledTransactions() {
  return await prisma.reconciledTransaction.findMany({});
}

export async function getReconciledTransactionById(id: number) {
  return await prisma.reconciledTransaction.findUnique({
    where: { id },
  });
}

export async function createReconciledTransaction(data: {
  reconciliationId: number;
  transactionId: number;
  isMatched: boolean;
  matchedAt: Date;
  notes?: string;
}) {
  return await prisma.reconciledTransaction.create({
    data,
  });
}

export async function updateReconciledTransaction(
  id: number,
  data: {
    reconciliationId?: number;
    transactionId?: number;
    isMatched?: boolean;
    matchedAt?: Date;
    notes?: string;
  }
) {
  return await prisma.reconciledTransaction.update({
    where: { id },
    data,
  });
}

export async function deleteReconciledTransaction(id: number) {
  return await prisma.reconciledTransaction.delete({
    where: { id },
  });
}
