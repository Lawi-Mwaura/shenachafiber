"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { List } from "@phosphor-icons/react/dist/icons/List";
import { X } from "@phosphor-icons/react/dist/icons/X";
import { useEffect, useState } from "react";

const navigation = [
  { label: "Internet", href: "/services/fiber-internet-nairobi" },
  { label: "CCTV", href: "/services/cctv-installation-nairobi" },
  { label: "Biometrics", href: "/services/biometric-access-control-nairobi" },
  { label: "Contact us", href: "/contact" },
  { label: "Help", href: "/help" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const closeMenu = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeMenu);
    return () => window.removeEventListener("keydown", closeMenu);
  }, [menuOpen]);

  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Shenacha Fiber home" prefetch={false}>
        <span>SHENACHA FIBER</span>
      </Link>
      <nav id="primary-navigation" className={menuOpen ? "nav-links is-open" : "nav-links"} aria-label="Primary navigation">
        {navigation.map((item) => (
          <Link
            className={pathname === item.href ? "is-current" : ""}
            href={item.href}
            prefetch={false}
            aria-current={pathname === item.href ? "page" : undefined}
            onClick={() => setMenuOpen(false)}
            key={item.href}
          >
            {item.label}
          </Link>
        ))}
        <div className="mobile-nav-actions">
          <Link className="button button-primary" href="/enquire" prefetch={false} onClick={() => setMenuOpen(false)}>Start an enquiry</Link>
          <Link className="button button-outline" href="/enquire?service=internet" prefetch={false} onClick={() => setMenuOpen(false)}>Discuss internet service</Link>
        </div>
      </nav>
      <div className="header-actions">
        <Link className="button button-primary header-coverage" href="/enquire" prefetch={false}>Start an enquiry</Link>
        <button className="menu-button" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-controls="primary-navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} aria-hidden="true" /> : <List size={24} aria-hidden="true" />}
        </button>
      </div>
    </header>
  );
}
