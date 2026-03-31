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

export async function generateMetadata() {
  const profile = await prisma.profile.findFirst();
  return {
    title: profile?.name ? `${profile.name} — Portfolio` : 'Portfolio',
    description: profile?.bio?.replace(/\*\*/g, '') || 'Personal Portfolio Website',
    openGraph: {
      title: profile?.name ? `${profile.name} — Portfolio` : 'Portfolio',
      description: profile?.bio?.replace(/\*\*/g, '') || 'Personal Portfolio Website',
      type: 'website',
    },
  };
}

export default async function HomePage() {
  const [profile, socialLinks, experiences, tools, projects, certificates] = await Promise.all([
    prisma.profile.findFirst(),
    prisma.socialLink.findMany({ orderBy: { order: 'asc' } }),
    prisma.experience.findMany({ orderBy: { order: 'asc' } }),
    prisma.tool.findMany({ orderBy: { order: 'asc' } }),
    prisma.project.findMany({ orderBy: { order: 'asc' } }),
    prisma.certificate.findMany({ orderBy: { order: 'asc' } }),
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
