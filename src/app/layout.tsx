import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import './globals.css';
import SiteChrome from '@/components/SiteChrome';

const display = Cormorant_Garamond({ subsets:['latin'], variable:'--font-display', weight:['400','500','600','700'] });
const sans = DM_Sans({ subsets:['latin'], variable:'--font-sans', weight:['400','500','600','700'] });

export const metadata: Metadata = {
  title:'M Square Interiors | Spaces That Inspire',
  description:'Thoughtful interior design, custom spaces and beautiful details by M Square Interiors.'
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${sans.variable}`}>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
