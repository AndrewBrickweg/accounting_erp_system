import prisma from "@/lib/prisma";

type AddressInput = {
  street?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  country?: string | null;
};

export async function getAllCustomers() {
  return await prisma.customer.findMany({
    include: { address: true },
  });
}

export async function getCustomerById(id: string) {
  return await prisma.customer.findUnique({
    where: { id },
    include: { address: true },
  });
}

export async function createCustomer(data: {
  firstName?: string;
  lastName?: string;
  companyName?: string;
  email: string;
  phone?: string;
  address?: AddressInput;
}) {
  return await prisma.customer.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      companyName: data.companyName,
      email: data.email,
      phone: data.phone,
      address: data.address ? { create: data.address } : undefined,
    },
    include: { address: true },
  });
}

export async function updateCustomer(
  id: string,
  data: {
    firstName?: string;
    lastName?: string;
    companyName?: string;
    email?: string;
    phone?: string;
    address?: AddressInput;
  }
) {
  const { address, ...rest } = data;

  return await prisma.customer.update({
    where: { id },
    data: {
      ...rest,
      ...(address
        ? {
            address: {
              upsert: {
                create: address,
                update: address,
              },
            },
          }
        : {}),
    },
    include: { address: true },
  });
}

export async function deleteCustomer(id: string) {
  return await prisma.customer.delete({
    where: { id },
    include: { address: true },
  });
}
