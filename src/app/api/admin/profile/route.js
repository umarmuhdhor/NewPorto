import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

const requireAuth = async () => {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse('Unauthorized', { status: 401 });
  return null;
};

// GET /api/admin/profile
export async function GET(req) {
  const err = await requireAuth(); if (err) return err;
  const profile = await prisma.profile.findFirst();
  return NextResponse.json(profile);
}

// PUT /api/admin/profile
export async function PUT(req) {
  const err = await requireAuth(); if (err) return err;
  const body = await req.json();
  const existing = await prisma.profile.findFirst();
  let profile;
  if (existing) {
    profile = await prisma.profile.update({ where: { id: existing.id }, data: body });
  } else {
    profile = await prisma.profile.create({ data: body });
  }
  return NextResponse.json(profile);
}
