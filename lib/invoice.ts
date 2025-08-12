import prisma from "@/lib/prisma";

export async function getAllInvoices() {
  return await prisma.invoice.findMany({
    include: {
      vendor: true,
    },
  });
}

export async function getInvoiceById(id: number) {
  return await prisma.invoice.findUnique({
    where: { id },
    include: {
      vendor: true,
    },
  });
}

export async function createInvoice(data: {
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  totalAmount: number;
  status: "draft" | "sent" | "paid" | "overdue";
  vendorId: number;
  submittedById: string;
  departmentId: number;
  currency?: string | null;
}) {
  return await prisma.invoice.create({ data });
}

export async function updateInvoice(
  id: number,
  data: {
    invoiceNumber?: string;
    invoiceDate?: Date;
    dueDate?: Date;
    totalAmount?: number;
    status?: "draft" | "sent" | "paid" | "overdue";
    vendorId?: number;
    submittedById?: string;
    departmentId?: number;
    currency?: string | null;
  }
) {
  return await prisma.invoice.update({
    where: { id },
    data,
    include: {
      vendor: true,
    },
  });
}

export async function deleteInvoice(id: number) {
  return await prisma.invoice.delete({
    where: { id },
    include: {
      vendor: true,
    },
  });
}
