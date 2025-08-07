import prisma from "@/lib/prisma";

export async function getAllVendors() {
  return await prisma.vendor.findMany({
    include: {
      employees: true,
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
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
}) {
  return await prisma.vendor.create({
    data: {
      name: data.name,
      contactName: data.contactName,
      email: data.email,
      phone: data.phone,
      address: data.address ? { create: data.address } : undefined,
    },
    include: { address: true, employees: true },
  });
}

export async function updateVendor(
  id: number,
  data: {
    name?: string;
    contactName?: string;
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
  return await prisma.vendor.update({
    where: { id },
    data,
  });
}

export async function deleteVendor(id: number) {
  return await prisma.vendor.delete({
    where: { id },
  });
}
