import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

const requireAuth = async () => {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse('Unauthorized', { status: 401 });
  return null;
};

const safeFields = (body) => ({
  title:       body.title       ?? '',
  company:     body.company     ?? '',
  location:    body.location    ?? null,
  startDate:   body.startDate   ?? null,
  endDate:     body.endDate     ?? null,
  current:     body.current     === true,
  description: body.description ?? null,
});

export async function GET() {
  const err = await requireAuth(); if (err) return err;
  return NextResponse.json(await prisma.experience.findMany({ orderBy: { order: 'asc' } }));
}

export async function POST(req) {
  const err = await requireAuth(); if (err) return err;
  const body = await req.json();
  const count = await prisma.experience.count();
  const item = await prisma.experience.create({ data: { ...safeFields(body), order: count } });
  return NextResponse.json(item, { status: 201 });
}

export async function PUT(req) {
  const err = await requireAuth(); if (err) return err;
  const body = await req.json();
  const { id } = body;
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const item = await prisma.experience.update({ where: { id }, data: safeFields(body) });
  return NextResponse.json(item);
}

export async function DELETE(req) {
  const err = await requireAuth(); if (err) return err;
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  await prisma.experience.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
