import { NextResponse } from "next/server";
import { validateSchema } from "@/lib/validate";
import { documentSchema } from "@/schemas/documents";
import { getAllDocuments, createDocument } from "@/lib/document";
import { handleError } from "@/lib/error";

export async function GET() {
  try {
    const documents = await getAllDocuments();
    return NextResponse.json(documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
    return handleError("Internal Server Error", 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateSchema(body, documentSchema);

    if (!validation.success) {
      return handleError("Validation failed", 400, {
        errors: validation.errors,
      });
    }

    const { fileName, fileUrl, uploadDate, invoiceId, uploadedById } =
      validation.data!;
    const document = await createDocument({
      fileName,
      fileUrl,
      uploadDate,
      invoiceId,
      uploadedById,
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error("Error creating document:", error);
    return handleError("Internal Server Error", 500);
  }
}
