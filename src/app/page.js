import prisma from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Experience from '@/components/Experience';
import Tools from '@/components/Tools';
import Projects from '@/components/Projects';
import Certificates from '@/components/Certificates';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import GSAPAnimations from '@/components/GSAPAnimations';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';
import MarqueeDivider from '@/components/MarqueeDivider';

export const dynamic = 'force-dynamic';

// Helper: retry once if DB is sleeping (Render free tier cold starts)
async function safeQuery(fn, fallback) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      return await fn();
    } catch (e) {
      if (attempt === 0 && (e.message?.includes('closed') || e.message?.includes('connect'))) {
        await new Promise(r => setTimeout(r, 800)); // wait for DB to wake
        continue;
      }
      console.error('[DB]', e.message?.slice(0, 120));
      return fallback;
    }
  }
  return fallback;
}

export default async function HomePage() {
  const [profile, socialLinks, experiences, tools, projects, certificates] = await Promise.all([
    safeQuery(() => prisma.profile.findFirst(), null),
    safeQuery(() => prisma.socialLink.findMany({ orderBy: { order: 'asc' } }), []),
    safeQuery(() => prisma.experience.findMany({ orderBy: { order: 'asc' } }), []),
    safeQuery(() => prisma.tool.findMany({ orderBy: { order: 'asc' } }), []),
    safeQuery(() => prisma.project.findMany({ orderBy: { order: 'asc' } }), []),
    safeQuery(() => prisma.certificate.findMany({ orderBy: { order: 'asc' } }), []),
  ]);

  return (
    <>
      <GSAPAnimations />
      <SmoothScrollProvider />
      <Navbar />
      <main>
        <Hero profile={profile} projects={projects} experiences={experiences} />
        <MarqueeDivider text="ABOUT ME" />
        <About profile={profile} socialLinks={socialLinks} />
        <MarqueeDivider text="EXPERIENCE" reverse />
        <Experience experiences={experiences} />
        <MarqueeDivider text="TECH STACK" />
        <Tools tools={tools} />
        <MarqueeDivider text="PROJECTS" reverse />
        <Projects projects={projects} />
        {certificates.length > 0 && (
          <>
            <MarqueeDivider text="CERTIFICATES" />
            <Certificates certificates={certificates} />
          </>
        )}
        <MarqueeDivider text="GET IN TOUCH" reverse />
        <Contact profile={profile} />
      </main>
      <Footer profile={profile} socialLinks={socialLinks} />
    </>
  );
}
