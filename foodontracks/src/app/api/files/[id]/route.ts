    }
  }
}
import { sendSuccess, sendError } from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";
 

/**
 * GET /api/files/[id]
 * Retrieves a single file by ID
 */

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  
  try {
    const { id } = await params;
    const fileId = parseInt(id);

    if (isNaN(fileId)) {
      return sendError(
        ERROR_CODES.VALIDATION_ERROR,
        "Invalid file ID",
        undefined,
        400
      );
    }

    const file = await prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      return sendError(
        ERROR_CODES.FILE_NOT_FOUND,
        "File not found",
        undefined,
        import { NextRequest } from "next/server";
        import { NextResponse } from "next/server";

        // Minimal, parse-safe handlers for /api/files/[id]
        export async function GET(_req: NextRequest, _ctx: any) {
          return NextResponse.json({ ok: true });
        }

        export const PATCH = async (_req: NextRequest, _ctx: any) => {
          return NextResponse.json({ ok: true });
        };

        export async function DELETE(_req: NextRequest, _ctx: any) {
          return NextResponse.json({ ok: true });
        }
