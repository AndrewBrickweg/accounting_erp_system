import prisma from "@/lib/prisma";

export async function getAllJournalLines() {
  return await prisma.journalLine.findMany({
    include: { journal: true, account: true },
  });
}

export async function getJournalLineById(id: number) {
  return await prisma.journalLine.findUnique({
    where: { id },
    include: { journal: true, account: true },
  });
}

export async function createJournalLine(data: {
  journalEntryId: number;
  accountId: number;
  departmentId: number;
  amount: number;
  isDebit: boolean;
}) {
  return await prisma.journalLine.create({ data });
}

export async function updateJournalLine(
  id: number,
  data: {
    journalEntryId?: number;
    accountId?: number;
    departmentId?: number;
    amount?: number;
    isDebit?: boolean;
  }
) {
  return await prisma.journalLine.update({
    where: { id },
    data,
    include: { journal: true, account: true },
  });
}

export async function deleteJournalLine(id: number) {
  return await prisma.journalLine.delete({
    where: { id },
    include: { journal: true, account: true },
  });
}
