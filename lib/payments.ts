import prisma from "@/lib/prisma";

export async function getAllPayments() {
  return await prisma.payment.findMany({
    include: { employee: true, method: true },
  });
}

export async function getPaymentById(id: number) {
  return await prisma.payment.findUnique({
    where: { id },
    include: { employee: true, method: true },
  });
}

export async function createPayment(data: {
  amountPaid: number;
  paymentDate: Date;
  method: "credit_card" | "ach" | "wire" | "check";
  invoiceId: number;
  paidById: string;
}) {
  return await prisma.payment.create({ data });
}

export async function updatePayment(
  id: number,
  data: {
    amountPaid?: number;
    paymentDate?: Date;
    method?: "credit_card" | "ach" | "wire" | "check";
    invoiceId?: number;
    paidById?: string;
  }
) {
  return await prisma.payment.update({
    where: { id },
    data,
    include: { employee: true, method: true },
  });
}

export async function deletePayment(id: number) {
  return await prisma.payment.delete({
    where: { id },
    include: { employee: true, method: true },
  });
}
