import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import ToastContainer from '@/components/Toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartSidebar from '@/components/CartSidebar';
import NextTopLoader from 'nextjs-toploader';
import OnboardingModal from '@/components/OnboardingModal';

import { Cinzel, Poppins, Space_Grotesk } from 'next/font/google';

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-premium',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '900'],
  variable: '--font-head',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'Time Lion – Premium Watch Store',
  description: 'Luxury timepieces for every wrist, every moment.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cinzel.variable} ${poppins.variable} ${spaceGrotesk.variable}`} style={{ colorScheme: 'light dark' }} data-scroll-behavior="smooth">
      <head>
        <meta name="color-scheme" content="light dark" />
      </head>
      <body>
        <NextTopLoader color="var(--teal)" showSpinner={false} height={3} />
        <AuthProvider>
          <CartProvider>
            <Navbar />
            {children}
            <Footer />
            <CartSidebar />
            <ToastContainer />
            <OnboardingModal />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}


