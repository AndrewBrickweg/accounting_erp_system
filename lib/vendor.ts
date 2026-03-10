import prisma from "@/lib/prisma";

type AddressInput = {
  street?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  country?: string | null;
};

export async function getAllVendors() {
  return await prisma.vendor.findMany({
    include: {
      invoices: true,
      address: true,
    },
  });
}

export async function getVendorById(id: number) {
  return await prisma.vendor.findUnique({
    where: { id },
  });
}

export async function createVendor(data: {
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address?: AddressInput;
}) {
  return await prisma.vendor.create({
    data: {
      name: data.name,
      contactName: data.contactName,
      email: data.email,
      phone: data.phone,
      address: data.address ? { create: data.address } : undefined,
    },
    include: { address: true, invoices: true },
  });
}

export async function updateVendor(
  id: number,
  data: {
    name?: string;
    contactName?: string;
    email?: string;
    phone?: string;
    address?: AddressInput;
  }
) {
  const { address, ...rest } = data;

  return await prisma.vendor.update({
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
  });
}

export async function deleteVendor(id: number) {
  return await prisma.vendor.delete({
    where: { id },
  });
}
