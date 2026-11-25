'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname === '/admin' || pathname.startsWith('/admin/');
  const [loading, setLoading] = useState(!isAdmin);

  useEffect(() => {
    if (isAdmin) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const startedAt = Date.now();
    const finish = () => {
      const remaining = Math.max(0, 1050 - (Date.now() - startedAt));
      const timer = window.setTimeout(() => setLoading(false), remaining);
      return () => window.clearTimeout(timer);
    };
    let cleanup: (() => void) | undefined;
    if (document.readyState === 'complete') cleanup = finish();
    else {
      const onLoad = () => { cleanup = finish(); };
      window.addEventListener('load', onLoad, { once: true });
      const fallback = window.setTimeout(() => { cleanup = finish(); }, 1800);
      return () => {
        window.removeEventListener('load', onLoad);
        window.clearTimeout(fallback);
        cleanup?.();
      };
    }
    return () => cleanup?.();
  }, [pathname, isAdmin]);

  return (
    <>
      {!isAdmin && loading && (
        <div className="m2-loader" role="status" aria-label="Loading M Square Interiors">
          <div className="m2-loader-content">
            <div className="m2-loader-mark">
              <span className="m2-loader-orbit" />
              <img src="/images/m2-logo-dark.png" alt="M² Interiors" />
            </div>
            <p className="m2-loader-caption">M² INTERIORS</p>
            <div className="m2-loader-track"><span /></div>
            <span className="m2-loader-subtitle">CRAFTING YOUR EXPERIENCE</span>
          </div>
        </div>
      )}
      {!isAdmin && <Header />}
      <main>{children}</main>
      {!isAdmin && <Footer />}
    </>
  );
}
