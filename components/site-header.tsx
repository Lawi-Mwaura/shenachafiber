"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { List } from "@phosphor-icons/react/dist/icons/List";
import { X } from "@phosphor-icons/react/dist/icons/X";
import { useEffect, useRef, useState } from "react";

const navigation = [
  { label: "About us", href: "/about" },
  { label: "Fibre internet", href: "/fibre-internet" },
  { label: "CCTV", href: "/cctv" },
  { label: "Biometric access", href: "/biometric-access" },
  { label: "Coverage", href: "/coverage" },
  { label: "Help", href: "/help" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const pageRegions = Array.from(document.querySelectorAll<HTMLElement>("body > main, body > footer"));
    const previousOverflow = document.body.style.overflow;
    pageRegions.forEach((region) => { region.inert = true; });
    document.body.style.overflow = "hidden";
    navRef.current?.querySelector<HTMLElement>("a")?.focus();

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = [menuButtonRef.current, ...Array.from(navRef.current?.querySelectorAll<HTMLElement>("a, button") ?? [])].filter(Boolean) as HTMLElement[];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
      pageRegions.forEach((region) => { region.inert = false; });
      document.body.style.overflow = previousOverflow;
      menuButtonRef.current?.focus();
    };
  }, [menuOpen]);

  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Shenacha Fiber home" prefetch={false}>
        <span>SHENACHA FIBER</span>
      </Link>
      {menuOpen ? <button className="menu-scrim" type="button" aria-label="Close navigation menu" onClick={() => setMenuOpen(false)} /> : null}
      <nav ref={navRef} id="primary-navigation" className={menuOpen ? "nav-links is-open" : "nav-links"} aria-label="Primary navigation">
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
        </div>
      </nav>
      <div className="header-actions">
        <Link className="button button-primary header-coverage" href="/enquire" prefetch={false}>Start an enquiry</Link>
        <button ref={menuButtonRef} className="menu-button" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-controls="primary-navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} aria-hidden="true" /> : <List size={24} aria-hidden="true" />}
        </button>
      </div>
    </header>
  );
}
