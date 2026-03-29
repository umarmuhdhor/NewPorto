const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  await prisma.user.upsert({
    where: { email: 'admin@porto.dev' },
    update: {},
    create: {
      email: 'admin@porto.dev',
      hashedPassword,
    },
  });

  // Create profile
  const existingProfile = await prisma.profile.findFirst();
  if (!existingProfile) {
    await prisma.profile.create({
      data: {
        name: 'Your Name',
        title: 'Full-Stack Developer',
        bio: 'Passionate developer specializing in **WEB DEVELOPMENT** and **CLOUD COMPUTING**. Experienced with **REACT**, **NODE.JS**, and modern web technologies. My goal is to build innovative, scalable solutions that make a difference.',
        photoUrl: '',
        cvUrl: '',
      },
    });
  }

  // Create social links
  const socialCount = await prisma.socialLink.count();
  if (socialCount === 0) {
    await prisma.socialLink.createMany({
      data: [
        { platform: 'GitHub', url: 'https://github.com', icon: 'github', order: 0 },
        { platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin', order: 1 },
        { platform: 'Email', url: 'mailto:hello@example.com', icon: 'email', order: 2 },
      ],
    });
  }

  // Create experiences
  const expCount = await prisma.experience.count();
  if (expCount === 0) {
    await prisma.experience.createMany({
      data: [
        {
          title: 'FULL-STACK DEVELOPER',
          organization: 'Tech Company',
          description: 'Built and maintained SCALABLE web applications using REACT, NODE.JS, and cloud services. Led a team of 5 developers on key projects. Implemented CI/CD PIPELINES and automated testing frameworks.',
          startDate: '2024',
          endDate: 'Present',
          type: 'experience',
          order: 0,
        },
        {
          title: 'FRONTEND DEVELOPER INTERN',
          organization: 'Startup Inc.',
          description: 'Developed responsive UI COMPONENTS with React and TypeScript. Collaborated with designers to implement PIXEL-PERFECT designs. Optimized application PERFORMANCE by 40%.',
          startDate: '2023',
          endDate: '2024',
          type: 'experience',
          order: 1,
        },
        {
          title: 'UNIVERSITY',
          organization: 'Bachelor of Computer Science',
          description: 'Studied COMPUTER SCIENCE with focus on SOFTWARE ENGINEERING and ALGORITHMS. Strong foundation in DATA STRUCTURES, OBJECT-ORIENTED PROGRAMMING, and WEB TECHNOLOGIES.',
          startDate: '2020',
          endDate: '2024',
          type: 'education',
          order: 2,
        },
      ],
    });
  }

  // Create tools
  const toolCount = await prisma.tool.count();
  if (toolCount === 0) {
    await prisma.tool.createMany({
      data: [
        { name: 'JavaScript', category: 'Language', order: 0 },
        { name: 'TypeScript', category: 'Language', order: 1 },
        { name: 'Python', category: 'Language', order: 2 },
        { name: 'React', category: 'Framework', order: 3 },
        { name: 'Next.js', category: 'Framework', order: 4 },
        { name: 'Node.js', category: 'Runtime', order: 5 },
        { name: 'PostgreSQL', category: 'Database', order: 6 },
        { name: 'Docker', category: 'DevOps', order: 7 },
        { name: 'Git', category: 'Tool', order: 8 },
        { name: 'Figma', category: 'Design', order: 9 },
        { name: 'AWS', category: 'Cloud', order: 10 },
        { name: 'Prisma', category: 'ORM', order: 11 },
      ],
    });
  }

  // Create projects
  const projCount = await prisma.project.count();
  if (projCount === 0) {
    await prisma.project.createMany({
      data: [
        {
          title: 'E-COMMERCE PLATFORM',
          subtitle: 'Full-Stack Shopping Experience',
          description: 'A modern e-commerce platform built with Next.js and Stripe integration, featuring real-time inventory management, user authentication, and responsive design.',
          status: 'Active',
          codeUrl: 'https://github.com',
          liveUrl: 'https://example.com',
          role: 'Full-Stack Developer',
          date: '2024',
          order: 0,
        },
        {
          title: 'TASK MANAGEMENT APP',
          subtitle: 'Productivity & Collaboration Tool',
          description: 'A real-time task management application with drag-and-drop functionality, team collaboration features, and automated workflow capabilities.',
          status: 'Completed',
          codeUrl: 'https://github.com',
          liveUrl: '',
          role: 'Frontend Developer',
          date: '2024',
          order: 1,
        },
        {
          title: 'AI CHAT ASSISTANT',
          subtitle: 'AI-Powered Conversation Platform',
          description: 'An intelligent chat assistant powered by machine learning, capable of natural language processing, context-aware responses, and multi-language support.',
          status: 'Active',
          codeUrl: 'https://github.com',
          liveUrl: 'https://example.com',
          role: 'Backend Developer',
          date: '2023',
          order: 2,
        },
      ],
    });
  }

  // Create certificates
  const certCount = await prisma.certificate.count();
  if (certCount === 0) {
    await prisma.certificate.createMany({
      data: [
        {
          title: 'AWS Cloud Practitioner',
          issuer: 'Amazon Web Services',
          description: 'Certification demonstrating cloud computing proficiency and AWS services knowledge.',
          year: '2024',
          type: 'Certification',
          order: 0,
        },
        {
          title: 'React Developer Certificate',
          issuer: 'Meta',
          description: 'Professional certification for advanced React development patterns and best practices.',
          year: '2024',
          type: 'Certification',
          order: 1,
        },
        {
          title: 'Hackathon Winner',
          issuer: 'TechFest 2024',
          description: 'First place in the annual university hackathon for building an innovative AI solution.',
          year: '2024',
          type: 'Achievement',
          order: 2,
        },
      ],
    });
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
