import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type Context = { params: Promise<{ id: string }> };

function validate(body: unknown) {
  if (!body || typeof body !== "object") return "Please provide student details.";
  const data = body as Record<string, unknown>;
  if (typeof data.name !== "string" || data.name.trim().length < 2 || data.name.trim().length > 80) return "Name must be between 2 and 80 characters.";
  if (typeof data.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) return "Please enter a valid email address.";
  if (typeof data.course !== "string" || data.course.trim().length < 1 || data.course.length > 40) return "Please select a valid course.";
  if (!Number.isInteger(Number(data.year)) || Number(data.year) < 1 || Number(data.year) > 4) return "Year must be between 1 and 4.";
  if (!Number.isFinite(Number(data.attendance)) || Number(data.attendance) < 0 || Number(data.attendance) > 100) return "Attendance must be between 0 and 100.";
  if (!Number.isFinite(Number(data.marks)) || Number(data.marks) < 0 || Number(data.marks) > 100) return "Marks must be between 0 and 100.";
  return null;
}

export async function PUT(request: Request, context: Context) {
  const { id: rawId } = await context.params;
  const id = Number(rawId);
  if (!Number.isInteger(id) || id < 1) return NextResponse.json({ error: "Invalid student ID." }, { status: 400 });

  try {
    const body: unknown = await request.json();
    const validationError = validate(body);
    if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });
    const data = body as Record<string, unknown>;
    const student = await prisma.student.update({
      where: { id },
      data: {
        name: String(data.name).trim(),
        email: String(data.email).trim().toLowerCase(),
        course: String(data.course).trim(),
        year: Number(data.year),
        attendance: Number(data.attendance),
        marks: Number(data.marks),
      },
    });
    return NextResponse.json(student);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ error: "Student not found." }, { status: 404 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "That email address is already registered." }, { status: 409 });
    }
    return NextResponse.json({ error: "Unable to update student." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: Context) {
  const { id: rawId } = await context.params;
  const id = Number(rawId);
  if (!Number.isInteger(id) || id < 1) return NextResponse.json({ error: "Invalid student ID." }, { status: 400 });

  try {
    await prisma.student.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ error: "Student not found." }, { status: 404 });
    }
    return NextResponse.json({ error: "Unable to delete student." }, { status: 500 });
  }
}
