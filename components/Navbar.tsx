'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, Sun, Laptop, Menu, X } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Research', href: '#research' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Education', href: '#education' },
  { label: 'Workshops', href: '#workshops' },
  { label: 'Contact', href: '#contact' },
];

export function Navbar() {
  const { theme, toggleTheme } = useThemeStore();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = NAV_LINKS.map((l) => l.href.slice(1));
      for (const id of sections.reverse()) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140) {
            setActiveSection(id);
            return;
          }
        }
      }
      setActiveSection('');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      setMenuOpen(false);
      const id = href.slice(1);
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    []
  );

  return (
    <>
      <nav
        className="nav"
        style={{
          boxShadow: scrolled ? '0 1px 3px 0 rgba(0, 0, 0, 0.05)' : 'none',
        }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: 800,
              fontSize: '1.1rem',
              color: 'var(--foreground)',
              textDecoration: 'none',
              letterSpacing: '-0.03em',
            }}
            aria-label="Back to top"
          >
            <span>Shuvo Molla</span>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />
          </a>

          {/* Desktop links */}
          <ul
            role="list"
            style={{
              display: 'flex',
              gap: '0.25rem',
              listStyle: 'none',
              alignItems: 'center',
            }}
            className="desktop-nav"
          >
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.slice(1);
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: 'var(--radius)',
                      fontSize: '0.85rem',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? 'var(--primary)' : 'var(--muted-foreground)',
                      backgroundColor: isActive ? 'var(--primary-subtle)' : 'transparent',
                      textDecoration: 'none',
                      transition: 'all 0.15s',
                      display: 'block',
                    }}
                    aria-current={isActive ? 'location' : undefined}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={toggleTheme}
              title={`Theme: ${theme} (Click to switch)`}
              aria-label={`Current theme: ${theme}. Click to switch theme mode`}
              style={{
                background: 'var(--secondary)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: '0.45rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--foreground)',
              }}
            >
              {theme === 'system' ? <Laptop size={15} /> : theme === 'dark' ? <Moon size={15} /> : <Sun size={15} />}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="mobile-menu-btn"
              style={{
                background: 'var(--secondary)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: '0.45rem',
                cursor: 'pointer',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--foreground)',
              }}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'fixed',
              top: '57px',
              left: 0,
              right: 0,
              zIndex: 99,
              backgroundColor: 'var(--background)',
              borderBottom: '1px solid var(--border)',
              padding: '1rem 1.5rem 1.5rem',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            }}
          >
            <ul role="list" style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    style={{
                      display: 'block',
                      padding: '0.6rem 0.75rem',
                      borderRadius: 'var(--radius)',
                      color: activeSection === link.href.slice(1) ? 'var(--primary)' : 'var(--foreground)',
                      backgroundColor: activeSection === link.href.slice(1) ? 'var(--primary-subtle)' : 'transparent',
                      fontWeight: activeSection === link.href.slice(1) ? 600 : 500,
                      textDecoration: 'none',
                      fontSize: '0.95rem',
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
