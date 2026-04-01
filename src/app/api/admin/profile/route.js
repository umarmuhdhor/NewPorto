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
  const socialLinks = await prisma.socialLink.findMany();
  
  // Extract specific URLs for the UI
  const data = {
    ...profile,
    github:   socialLinks.find(s => s.platform.toLowerCase() === 'github')?.url   || '',
    linkedin: socialLinks.find(s => s.platform.toLowerCase() === 'linkedin')?.url || '',
    email:    socialLinks.find(s => s.platform.toLowerCase() === 'email')?.url    || '',
  };
  
  return NextResponse.json(data);
}

// PUT /api/admin/profile
export async function PUT(req) {
  const err = await requireAuth(); if (err) return err;
  const { github, linkedin, email, ...profileData } = await req.json();
  
  // 1. Update Profile
  const existing = await prisma.profile.findFirst();
  let profile;
  if (existing) {
    profile = await prisma.profile.update({ where: { id: existing.id }, data: profileData });
  } else {
    profile = await prisma.profile.create({ data: profileData });
  }

  // 2. Update/Create Social Links
  const socialMaps = [
    { platform: 'GitHub',   url: github,   icon: 'github' },
    { platform: 'LinkedIn', url: linkedin, icon: 'linkedin' },
    { platform: 'Email',    url: email,    icon: 'email' },
  ];

  for (const s of socialMaps) {
    if (s.url === undefined) continue;
    const existingLink = await prisma.socialLink.findFirst({
      where: { platform: { equals: s.platform, mode: 'insensitive' } }
    });
    
    if (existingLink) {
      await prisma.socialLink.update({
        where: { id: existingLink.id },
        data: { url: s.url, icon: s.icon }
      });
    } else if (s.url) {
      await prisma.socialLink.create({
        data: { platform: s.platform, url: s.url, icon: s.icon }
      });
    }
  }

  return NextResponse.json(profile);
}
