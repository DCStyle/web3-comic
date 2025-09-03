import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { comicUpload } from "@/lib/validation/schemas";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const comic = await prisma.comic.findUnique({
      where: { id: params.id },
      include: {
        volumes: {
          include: {
            chapters: {
              include: {
                pages: true,
                unlocks: true,
              }
            }
          }
        },
        tags: true,
      }
    });

    if (!comic) {
      return NextResponse.json({ error: "Comic not found" }, { status: 404 });
    }

    return NextResponse.json(comic);
  } catch (error) {
    console.error("Failed to fetch comic:", error);
    return NextResponse.json({ error: "Failed to fetch comic" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = comicUpload.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const comic = await prisma.comic.update({
      where: { id: params.id },
      data: {
        ...parsed.data,
        updatedAt: new Date(),
      }
    });

    return NextResponse.json(comic);
  } catch (error) {
    console.error("Failed to update comic:", error);
    return NextResponse.json({ error: "Failed to update comic" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if comic exists
    const comic = await prisma.comic.findUnique({
      where: { id: params.id },
      select: { id: true, title: true }
    });

    if (!comic) {
      return NextResponse.json({ error: "Comic not found" }, { status: 404 });
    }

    // Delete comic (cascades to volumes, chapters, pages, unlocks due to schema)
    await prisma.comic.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ 
      ok: true, 
      message: `Comic "${comic.title}" deleted successfully` 
    });
  } catch (error) {
    console.error("Failed to delete comic:", error);
    return NextResponse.json({ error: "Failed to delete comic" }, { status: 500 });
  }
}