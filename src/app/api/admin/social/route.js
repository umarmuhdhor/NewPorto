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
  platform: body.platform ?? '',
  url:      body.url      ?? '',
  label:    body.label    ?? null,
  icon:     body.icon     ?? null,
});

export async function GET() {
  const err = await requireAuth(); if (err) return err;
  return NextResponse.json(await prisma.socialLink.findMany({ orderBy: { order: 'asc' } }));
}

export async function POST(req) {
  const err = await requireAuth(); if (err) return err;
  const body = await req.json();
  const count = await prisma.socialLink.count();
  const item = await prisma.socialLink.create({ data: { ...safeFields(body), order: count } });
  return NextResponse.json(item, { status: 201 });
}

export async function PUT(req) {
  const err = await requireAuth(); if (err) return err;
  const body = await req.json();
  const { id } = body;
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const item = await prisma.socialLink.update({ where: { id }, data: safeFields(body) });
  return NextResponse.json(item);
}

export async function DELETE(req) {
  const err = await requireAuth(); if (err) return err;
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  await prisma.socialLink.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
