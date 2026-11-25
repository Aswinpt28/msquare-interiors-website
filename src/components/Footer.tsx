import Link from 'next/link';
import Image from 'next/image';

export default function Footer(){
  return <footer className="footer">
    <div className="footer-main">
      <div className="footer-brand">
        <Link href="/" aria-label="M2 Interiors home">
          <Image src="/images/m2-logo-light.png" alt="M Square Interiors — Spaces That Inspire" width={220} height={110}/>
        </Link>
        <p className="footer-tagline">Spaces that inspire.<br/>Details that matter.</p>
      </div>
      <div className="footer-links-column">
        <p className="eyebrow">EXPLORE</p>
        <div className="footer-links">
          <Link href="/">Home</Link>
          <Link href="/services">Interior design</Link>
          <Link href="/gallery">Gallery</Link>
          <Link href="/furniture">Furniture</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </div>
      <div className="footer-address-column">
        <p className="eyebrow">VISIT OUR STUDIO</p>
        <address>#203, V V Centre,<br/>Palarivattom,<br/>Cochin - 682025</address>
      </div>
    </div>
    <div className="footer-bottom">
      <span>© {new Date().getFullYear()} M Square Interiors</span>
      <span>Designed with intention.</span>
    </div>
  </footer>;
}
