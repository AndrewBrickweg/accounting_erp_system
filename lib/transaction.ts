import prisma from "@/lib/prisma";

export async function getAllTransactions() {
  return await prisma.transaction.findMany();
}

export async function getTransactionById(id: string) {
  return await prisma.transaction.findUnique({
    where: { id },
    include: {
      entries: {
        include: {
          account: true,
        },
      },
    },
  });
}

export async function createTransaction(data: {
  date?: Date;
  memo?: string;
  referenceNumber?: string;
  type: "journal" | "payment" | "receipt" | "transfer";
  source?: string;
  status?: "draft" | "posted" | "void";
  postedAt?: Date | null;
}) {
  return await prisma.transaction.create({
    data,
    include: {
      entries: {
        include: {
          account: true,
        },
      },
    },
  });
}

export async function updateTransaction(
  id: string,
  data: {
    date?: Date;
    memo?: string;
    referenceNumber?: string;
    type?: "journal" | "payment" | "receipt" | "transfer";
    source?: string;
    status?: "draft" | "posted" | "void";
    postedAt?: Date | null;
  }
) {
  return await prisma.transaction.update({
    where: { id },
    data,
    include: {
      entries: {
        include: {
          account: true,
        },
      },
    },
  });
}

export async function deleteTransaction(id: string) {
  return await prisma.transaction.delete({
    where: { id },
  });
}
