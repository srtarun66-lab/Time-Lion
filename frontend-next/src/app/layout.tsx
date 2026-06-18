import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import ToastContainer from '@/components/Toast';
import NextTopLoader from 'nextjs-toploader';

import { Cinzel, Poppins, Space_Grotesk } from 'next/font/google';

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-premium',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '900'],
  variable: '--font-head',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.timelion.in'),
  title: {
    default: 'Time Lion – Premium Watches Online | Luxury Timepieces India',
    template: '%s | Time Lion – Premium Watches',
  },
  description:
    'Shop premium analog and digital watches at Time Lion. Explore Classic Metal, Digital Mania & Special Combo collections. Luxury timepieces crafted for every wrist. Free shipping on orders above ₹999. 1-Year Warranty.',
  keywords: [
    'premium watches India',
    'luxury watches online',
    'buy watches online India',
    'analog watches',
    'digital watches',
    'classic metal watches',
    'watch store India',
    'affordable luxury watches',
    'men watches',
    'women watches',
    'Time Lion watches',
    'watch combo offer',
  ],
  authors: [{ name: 'Time Lion', url: 'https://www.timelion.in' }],
  creator: 'Time Lion',
  publisher: 'Time Lion',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.timelion.in',
    siteName: 'Time Lion',
    title: 'Time Lion – Premium Watches Online | Luxury Timepieces India',
    description:
      'Shop premium analog and digital watches at Time Lion. Classic Metal, Digital Mania & Special Combo collections. Free shipping on orders above ₹999.',
    images: [
      {
        url: '/og-image.jpeg',
        width: 1200,
        height: 630,
        alt: 'Time Lion – Premium Watch Store',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@timelionin',
    creator: '@timelionin',
    title: 'Time Lion – Premium Watches Online | Luxury Timepieces India',
    description:
      'Shop premium analog and digital watches. Classic Metal, Digital Mania & Special Combo collections. Free shipping on orders above ₹999.',
    images: ['/og-image.jpeg'],
  },
  alternates: {
    canonical: 'https://www.timelion.in',
  },
  verification: {
    google: 'ADD_YOUR_GOOGLE_SITE_VERIFICATION_HERE',
  },
  category: 'shopping',
};

// JSON-LD structured data
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Time Lion',
  url: 'https://www.timelion.in',
  logo: 'https://www.timelion.in/logo.jpeg',
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+91-7418719580',
      contactType: 'customer service',
      availableLanguage: ['English', 'Tamil'],
    },
  ],
  sameAs: [
    'https://www.instagram.com/timelionin',
    'https://wa.me/917418719580',
  ],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Time Lion',
  url: 'https://www.timelion.in',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://www.timelion.in/category/classic-metal?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

const storeSchema = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: 'Time Lion',
  description: 'Premium watch store offering luxury analog and digital timepieces.',
  url: 'https://www.timelion.in',
  priceRange: '₹₹',
  currenciesAccepted: 'INR',
  paymentAccepted: 'Cash, Credit Card, Debit Card, UPI',
  image: 'https://www.timelion.in/og-image.jpeg',
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
        <meta name="theme-color" content="#060604" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="canonical" href="https://www.timelion.in" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(storeSchema) }}
        />
      </head>
      <body>
        <NextTopLoader color="var(--teal)" showSpinner={false} height={3} />
        <AuthProvider>
          <CartProvider>
            {children}
            <ToastContainer />
          </CartProvider>
        </AuthProvider>

        {/* Google Analytics 4 */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-KQX5B7EN57" strategy="afterInteractive" />
        <Script id="ga4" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-KQX5B7EN57', { page_path: window.location.pathname });
          `}
        </Script>
      </body>
    </html>
  );
}
