import prisma from "@/lib/prisma";

export async function getAllJournalEntries() {
  return await prisma.journalEntry.findMany();
}

export async function getJournalEntryById(id: number) {
  return await prisma.journalEntry.findUnique({
    where: { id },
  });
}

export async function createJournalEntry(data: {
  entryDate: Date;
  memo: string | null;
  createdById: string;
  periodId: number;
  referenceNumber?: string;
  source?: string;
}) {
  return await prisma.journalEntry.create({ data });
}

export async function updateJournalEntry(
  id: number,
  data: {
    entryDate?: Date;
    memo?: string | null;
    createdById?: string;
    periodId?: number;
    referenceNumber?: string;
    source?: string;
  }
) {
  return await prisma.journalEntry.update({
    where: { id },
    data,
  });
}

export async function deleteJournalEntry(id: number) {
  return await prisma.journalEntry.delete({
    where: { id },
  });
}
