import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

const requireAuth = async () => {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse('Unauthorized', { status: 401 });
  return null;
};

// Pick only known fields to prevent mass assignment
const safeProjectFields = (body) => ({
  title:       body.title       ?? '',
  subtitle:    body.subtitle    ?? null,
  description: body.description ?? '',
  backstory:   body.backstory   ?? null,
  flow:        body.flow        ?? null,
  techStack:   body.techStack   ?? null,
  imageUrl:    body.imageUrl    ?? null,
  status:      ['Active', 'Completed', 'Archived'].includes(body.status) ? body.status : 'Completed',
  codeUrl:     body.codeUrl     ?? null,
  liveUrl:     body.liveUrl     ?? null,
  role:        body.role        ?? null,
  date:        body.date        ?? null,
});

export async function GET() {
  const err = await requireAuth(); if (err) return err;
  return NextResponse.json(await prisma.project.findMany({ orderBy: { order: 'asc' } }));
}

export async function POST(req) {
  const err = await requireAuth(); if (err) return err;
  const body = await req.json();
  const count = await prisma.project.count();
  const item = await prisma.project.create({
    data: { ...safeProjectFields(body), order: count },
  });
  return NextResponse.json(item, { status: 201 });
}

export async function PUT(req) {
  const err = await requireAuth(); if (err) return err;
  const body = await req.json();
  const { id } = body;
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const item = await prisma.project.update({
    where: { id },
    data: safeProjectFields(body),
  });
  return NextResponse.json(item);
}

export async function DELETE(req) {
  const err = await requireAuth(); if (err) return err;
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
