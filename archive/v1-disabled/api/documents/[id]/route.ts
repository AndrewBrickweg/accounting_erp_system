import { NextResponse } from "next/server";
import { validateSchema } from "@/lib/validate";
import { documentUpdateSchema } from "@/schemas/documents";
import {
  getDocumentById,
  updateDocument,
  deleteDocument,
} from "@/lib/document";
import { handleError } from "@/lib/error";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const document = await getDocumentById(params.id);

    if (!document) {
      return handleError("Document not found", 404);
    }

    return NextResponse.json(document);
  } catch (error) {
    console.error("Error fetching document:", error);
    return handleError("Internal Server Error", 500);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validation = validateSchema(body, documentUpdateSchema);

    if (!validation.success) {
      return handleError("Validation failed", 400, {
        errors: validation.errors,
      });
    }

    const updatedDocument = await updateDocument(params.id, {
      fileName: validation.data?.fileName,
      fileUrl: validation.data?.fileUrl,
      uploadDate: validation.data?.uploadDate,
      invoiceId: validation.data?.invoiceId ?? null,
      uploadedById: validation.data?.uploadedById ?? null,
      fileSize: validation.data?.fileSize ?? undefined,
      type: validation.data?.type,
    });

    return NextResponse.json(updatedDocument);
  } catch (error) {
    console.error("Error updating document:", error);
    return handleError("Internal Server Error", 500);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const deletedDocument = await deleteDocument(params.id);

    if (!deletedDocument) {
      return handleError("Document not found", 404);
    }

    return NextResponse.json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Error deleting document:", error);
    return handleError("Internal Server Error", 500);
  }
}
