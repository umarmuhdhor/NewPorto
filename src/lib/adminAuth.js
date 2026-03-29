import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Shared auth guard used by admin route handlers
export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse('Unauthorized', { status: 401 });
  return null;
}

// Public profile fetch (no auth — used by page.js server components)
export async function GET_profile() {
  const profile = await prisma.profile.findFirst();
  return NextResponse.json(profile);
}
