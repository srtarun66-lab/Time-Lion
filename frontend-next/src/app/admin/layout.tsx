import type { Metadata } from 'next';
import './admin.css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
import Sidebar from '@/components/admin/Sidebar';
import AdminAuth from '@/components/admin/AdminAuth';

export const metadata: Metadata = {
  title: 'Time Lion Admin Portal',
  description: 'Manage products and orders for Time Lion Watch Store',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-portal">
      <AdminAuth>
        <div className="admin-wrap">
          <Sidebar />
          <main className="main">
            {children}
          </main>
        </div>
      </AdminAuth>
    </div>
  );
}
