import type { Metadata } from 'next';
import { Noto_Serif } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';
import { ThemeProvider } from '@/components/ThemeProvider';
import GlobalSplash from '@/components/GlobalSplash';
import AiSidebar from '@/components/AiSidebar';

const notoSerif = Noto_Serif({
  subsets: ['latin'],
  variable: '--font-noto',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'HizmetBul — Güvenilir Yerel Hizmet Verenler',
  description:
    'Güvenilir yerel hizmet verenleri bulun ve doğrudan arayın. Temizlik, nakliyat, tamirat, web tasarım ve daha fazlası.',
  keywords: 'hizmet, temizlik, nakliyat, tamirat, web tasarım, özel ders, Türkiye',
  openGraph: {
    title: 'HizmetBul — Güvenilir Yerel Hizmet Verenler',
    description: 'Güvenilir yerel hizmet verenleri bulun ve doğrudan arayın.',
    type: 'website',
    locale: 'tr_TR',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" className={notoSerif.variable} suppressHydrationWarning>
      <head>
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark') {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className={`${notoSerif.className} antialiased bg-white dark:bg-[#050505] text-gray-900 dark:text-gray-100 transition-colors duration-300`} suppressHydrationWarning>
        <ThemeProvider>
          <GlobalSplash />
          <Navbar />
          <Sidebar />
          <AiSidebar />
          <main className="md:pl-[80px] transition-all duration-300">{children}</main>
          <div className="md:pl-[80px]"><Footer /></div>
        </ThemeProvider>
      </body>
    </html>
  );
}
