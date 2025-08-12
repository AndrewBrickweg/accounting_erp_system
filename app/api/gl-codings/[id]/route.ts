import { NextResponse } from "next/server";
import { validateSchema } from "@/lib/validate";
import { glCodingUpdateSchema } from "@/schemas/gl-codings";
import {
  getGlCodingById,
  updateGlCoding,
  deleteGlCoding,
} from "@/lib/gl-coding";
import { handleError } from "@/lib/error";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const glCoding = await getGlCodingById(parseInt(params.id));

    if (!glCoding) {
      return handleError("GL Coding not found", 404);
    }

    return NextResponse.json(glCoding);
  } catch (error) {
    console.error("Error fetching GL Coding:", error);
    return handleError("Internal Server Error", 500);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validation = validateSchema(body, glCodingUpdateSchema);

    if (!validation.success) {
      return handleError("Validation failed", 400, {
        errors: validation.errors,
      });
    }

    const updatedGlCoding = await updateGlCoding(parseInt(params.id), {
      accountId: validation.data?.accountId,
      amount: validation.data?.amount,
      type: validation.data?.type,
      description: validation.data?.description,
      invoiceId: validation.data?.invoiceId || null,
      departmentId: validation.data?.departmentId || null,
      memo: validation.data?.memo || null,
      transactionId: validation.data?.transactionId || null,
    });

    return NextResponse.json(updatedGlCoding);
  } catch (error) {
    console.error("Error updating GL Coding:", error);
    return handleError("Internal Server Error", 500);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const deletedGlCoding = await deleteGlCoding(parseInt(params.id));

    if (!deletedGlCoding) {
      return handleError("GL Coding not found", 404);
    }

    return NextResponse.json({ message: "GL Coding deleted successfully" });
  } catch (error) {
    console.error("Error deleting GL Coding:", error);
    return handleError("Internal Server Error", 500);
  }
}
