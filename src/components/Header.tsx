"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Interiors" },
  { href: "/gallery", label: "Gallery" },
  { href: "/furniture", label: "Furniture" },
//   { href: "/contact", label: "Contact" },
];
export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="M Square Interiors home">
        <Image
          src="/images/m2-logo-dark.png"
          alt="M2 Interiors — Spaces That Inspire"
          width={190}
          height={95}
          priority
        />
      </Link>
      <button
        className="menu-toggle"
        onClick={() => setOpen(!open)}
        aria-label="Toggle navigation"
      >
        {open ? <X /> : <Menu />}
      </button>
      <nav className={open ? "nav nav-open" : "nav"}>
        {links.map((l) => (
          <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </Link>
        ))}
        <Link
          className="nav-cta"
          href="/contact"
          onClick={() => setOpen(false)}
        >
          Let’s talk <span>↗</span>
        </Link>
      </nav>
    </header>
  );
}
