import prisma from "@/lib/prisma";

export async function getAllAccountingPeriods() {
  return await prisma.accoutningPeriod.findMany({
    orderBy: { startDate: "asc" },
    select: {
      id: true,
      periodName: true,
      startDate: true,
      endDate: true,
    },
  });
}

export async function getAccountingPeriodById(id: number) {
  return await prisma.accoutningPeriod.findUnique({
    where: { id },
    select: {
      id: true,
      periodName: true,
      startDate: true,
      endDate: true,
    },
  });
}

export async function createAccountingPeriod(data: {
  periodName: string;
  startDate: Date;
  endDate: Date;
}) {
  return await prisma.accoutningPeriod.create({ data });
}

export async function updateAccountingPeriod(
  id: number,
  data: {
    periodName?: string;
    startDate?: Date;
    endDate?: Date;
  }
) {
  return await prisma.accoutningPeriod.update({
    where: { id },
    data,
    select: {
      id: true,
      periodName: true,
      startDate: true,
      endDate: true,
    },
  });
}

export async function deleteAccountingPeriod(id: number) {
  return await prisma.accoutningPeriod.delete({
    where: { id },
    select: {
      id: true,
      periodName: true,
      startDate: true,
      endDate: true,
    },
  });
}
