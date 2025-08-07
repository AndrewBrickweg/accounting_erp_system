import prisma from "@/lib/prisma";

export async function getAllAccountingPeriods() {
  return await prisma.accountingPeriod.findMany({
    orderBy: { startDate: "asc" },
    select: {
      id: true,
      periodName: true,
      startDate: true,
      endDate: true,
      isClosed: true,
      createdAt: true,
    },
  });
}

export async function getAccountingPeriodById(id: number) {
  return await prisma.accountingPeriod.findUnique({
    where: { id },
    select: {
      id: true,
      periodName: true,
      startDate: true,
      endDate: true,
      isClosed: true,
      createdAt: true,
    },
  });
}

export async function createAccountingPeriod(data: {
  periodName: string;
  startDate: Date;
  endDate: Date;
  isClosed?: boolean;
}) {
  return await prisma.accountingPeriod.create({ data });
}

export async function updateAccountingPeriod(
  id: number,
  data: {
    periodName?: string;
    startDate?: Date;
    endDate?: Date;
    isClosed?: boolean;
  }
) {
  return await prisma.accountingPeriod.update({
    where: { id },
    data,
    select: {
      id: true,
      periodName: true,
      startDate: true,
      endDate: true,
      isClosed: true,
      createdAt: true,
    },
  });
}

export async function deleteAccountingPeriod(id: number) {
  return await prisma.accountingPeriod.delete({
    where: { id },
    select: {
      id: true,
      periodName: true,
      startDate: true,
      endDate: true,
      isClosed: true,
      createdAt: true,
    },
  });
}
