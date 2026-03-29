import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse('Unauthorized', { status: 401 });

  const { current, newPass } = await req.json();

  // Validate new password before touching the database
  if (!newPass || typeof newPass !== 'string' || newPass.length < 8) {
    return NextResponse.json(
      { error: 'New password must be at least 8 characters.' },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const valid = await bcrypt.compare(current, user.hashedPassword);
  if (!valid) return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 });

  const hashed = await bcrypt.hash(newPass, 12);
  await prisma.user.update({ where: { id: user.id }, data: { hashedPassword: hashed } });

  return NextResponse.json({ success: true });
}
