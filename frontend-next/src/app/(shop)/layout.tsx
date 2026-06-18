import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartSidebar from '@/components/CartSidebar';
import OnboardingModal from '@/components/OnboardingModal';

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <CartSidebar />
      <OnboardingModal />
    </>
  );
}
