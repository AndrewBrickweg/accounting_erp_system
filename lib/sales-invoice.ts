import prisma from "@/lib/prisma";

export async function getAllSalesInvoices() {
  return await prisma.salesInvoice.findMany({
    include: { customer: true, items: true },
  });
}
export async function getSalesInvoiceById(id: number) {
  return await prisma.salesInvoice.findUnique({
    where: { id },
    include: { customer: true, items: true },
  });
}

export async function createSalesInvoice(data: {
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  totalAmount: number;
  status: "pending" | "paid" | "overdue";
  customerId: string;
  submittedById: string;
  currency: string;
  taxAmount?: number | null;
}) {
  return await prisma.salesInvoice.create({ data });
}

export async function updateSalesInvoice(
  id: number,
  data: {
    invoiceNumber?: string;
    invoiceDate?: Date;
    dueDate?: Date;
    totalAmount?: number;
    status?: "pending" | "paid" | "overdue";
    customerId?: string;
    submittedById?: string;
    currency?: string;
    taxAmount?: number | null;
  }
) {
  return await prisma.salesInvoice.update({
    where: { id },
    data,
    include: { customer: true, items: true },
  });
}

export async function deleteSalesInvoice(id: number) {
  return await prisma.salesInvoice.delete({
    where: { id },
    include: { customer: true, items: true },
  });
}
