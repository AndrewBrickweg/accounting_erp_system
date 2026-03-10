import prisma from "@/lib/prisma";

export async function getAllInvoiceApprovalLogs() {
  return await prisma.invoiceApprovalLog.findMany({
    include: { invoice: true, approvedBy: true },
  });
}

export async function getInvoiceApprovalLogById(id: number) {
  return await prisma.invoiceApprovalLog.findUnique({
    where: { id },
    include: { invoice: true, approvedBy: true },
  });
}

export async function createInvoiceApprovalLog(data: {
  approvalOrder: number;
  approvalDate: Date;
  status: "APPROVED" | "REJECTED";
  comments?: string | null;
  invoiceId: number;
  approvedById: string;
}) {
  return await prisma.invoiceApprovalLog.create({ data });
}

export async function updateInvoiceApprovalLog(
  id: number,
  data: {
    approvalOrder?: number;
    approvalDate?: Date;
    status?: "APPROVED" | "REJECTED";
    comments?: string | null;
    invoiceId?: number;
    approvedById?: string;
  }
) {
  return await prisma.invoiceApprovalLog.update({
    where: { id },
    data,
    include: { invoice: true, approvedBy: true },
  });
}

export async function deleteInvoiceApprovalLog(id: number) {
  return await prisma.invoiceApprovalLog.delete({
    where: { id },
    include: { invoice: true, approvedBy: true },
  });
}
