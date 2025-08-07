import prisma from "@/lib/prisma";

export async function getAllDocuments() {
  return await prisma.document.findMany({
    include: { invoice: true, uploadedBy: true },
  });
}

export async function getDocumentById(id: number) {
  return await prisma.document.findUnique({
    where: { id },
    include: { invoice: true, uploadedBy: true },
  });
}

export async function createDocument(data: {
  fileName: string;
  fileUrl: string;
  uploadDate?: Date;
  invoiceId?: number | null;
  uploadedById?: number | null;
}) {
  return await prisma.document.create({ data });
}

export async function updateDocument(
  id: number,
  data: {
    fileName?: string;
    fileUrl?: string;
    uploadDate?: Date;
    invoiceId?: number | null;
    uploadedById?: number | null;
  }
) {
  return await prisma.document.update({
    where: { id },
    data,
    include: { invoice: true, uploadedBy: true },
  });
}

export async function deleteDocument(id: number) {
  return await prisma.document.delete({
    where: { id },
    include: { invoice: true, uploadedBy: true },
  });
}
