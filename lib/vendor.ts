import prisma from "@/lib/prisma";

export async function getAllVendors() {
  return await prisma.vendor.findMany({
    include: {
      employees: true,
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
  address: string;
}) {
  return await prisma.vendor.create({ data });
}

export async function updateVendor(
  id: number,
  data: {
    name?: string;
    contactName?: string;
    email?: string;
    phone?: string;
    address?: string;
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
