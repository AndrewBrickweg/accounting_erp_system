import prisma from "@/lib/prisma";

export async function getAllChartOfAccounts() {
  return await prisma.chartOfAccount.findMany({
    where: { isActive: true },
  });
}

export async function getChartOfAccountById(id: number) {
  return await prisma.chartOfAccount.findUnique({
    where: { id },
  });
}

export async function createChartOfAccount(data: {
  accountNumber: string;
  name: string;
  type: "asset" | "liability" | "equity" | "revenue" | "expense";
  isActive?: boolean;
}) {
  return await prisma.chartOfAccount.create({ data });
}

export async function updateChartOfAccount(
  id: number,
  data: {
    accountNumber?: string;
    name?: string;
    type?: "asset" | "liability" | "equity" | "revenue" | "expense";
    isActive?: boolean;
  }
) {
  return await prisma.chartOfAccount.update({
    where: { id },
    data,
  });
}

export async function deleteChartOfAccount(id: number) {
  return await prisma.chartOfAccount.delete({
    where: { id },
  });
}
