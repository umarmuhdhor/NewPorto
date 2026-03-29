import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import AdminLayoutClient from '../AdminLayoutClient';

export default async function PanelLayout({ children }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/admin/login');
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
