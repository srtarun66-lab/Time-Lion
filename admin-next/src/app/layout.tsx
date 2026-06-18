import type { Metadata } from 'next';
import './globals.css';
import NextTopLoader from 'nextjs-toploader';
import Sidebar from '@/components/Sidebar';
import ToastContainer from '@/components/Toast';

import AdminAuth from '@/components/AdminAuth';

export const metadata: Metadata = {
  title: 'Time Lion Admin Portal',
  description: 'Manage products and orders for Time Lion Watch Store',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NextTopLoader color="var(--teal)" showSpinner={false} height={3} />
        <AdminAuth>
          <div className="admin-wrap">
            <Sidebar />
            <main className="main">
              {children}
            </main>
          </div>
        </AdminAuth>
        <ToastContainer />
      </body>
    </html>
  );
}
