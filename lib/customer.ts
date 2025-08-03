import prisma from "@/lib/prisma";

export async function getAllCustomers() {
  return await prisma.Customer.findMany({
    include: { address: true },
  });
}

export async function getCustomerById(id: number) {
  return await prisma.Customer.findUnique({
    where: { id },
    inclyde: { address: true },
  });
}

export async function createCustomer(data: {
  firstName?: string;
  lastName?: string;
  companyName?: string;
  email: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
}) {
  return await prisma.Customer.create({ data });
}

export async function updateCustomer(
  id: number,
  data: {
    firstName?: string;
    lastName?: string;
    companyName?: string;
    email?: string;
    phone?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zip?: string;
      country?: string;
    };
  }
) {
  return await prisma.Customer.update({
    where: { id },
    data,
    include: { address: true },
  });
}

export async function deleteCustomer(id: number) {
  return await prisma.Customer.delete({
    where: { id },
    include: { address: true },
  });
}
