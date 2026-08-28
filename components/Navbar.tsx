'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, Sun, Laptop, Menu, X, ArrowUpRight } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Research', href: '#research' },
  { label: 'Milestones', href: '#achievements' },
  { label: 'Education', href: '#education' },
  { label: 'Workshops', href: '#workshops' },
];

export function Navbar() {
  const { theme, toggleTheme } = useThemeStore();
  const [activeSection, setActiveSection] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const sections = ['contact', 'workshops', 'education', 'achievements', 'research', 'experience', 'skills', 'about'];
          for (const id of sections) {
            const el = document.getElementById(id);
            if (el) {
              const rect = el.getBoundingClientRect();
              if (rect.top <= 180) {
                setActiveSection(id);
                ticking = false;
                return;
              }
            }
          }
          setActiveSection('');
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    const id = href.slice(1);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <>
      {/* Floating Fluid Island Navigation */}
      <header
        style={{
          position: 'fixed',
          top: '1rem',
          left: 0,
          right: 0,
          zIndex: 100,
          display: 'flex',
          justifyContent: 'center',
          pointerEvents: 'none',
          padding: '0 1rem',
        }}
      >
        <div
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.5rem 0.35rem 1.15rem',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-strong)',
            boxShadow: 'var(--shadow-float)',
            backdropFilter: 'blur(16px)',
            maxWidth: '100%',
            transform: 'translateZ(0)',
          }}
        >
          {/* Brand Initial */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              fontWeight: 800,
              fontSize: '0.925rem',
              color: 'var(--fg)',
              textDecoration: 'none',
              letterSpacing: '-0.03em',
              marginRight: '0.65rem',
              whiteSpace: 'nowrap',
            }}
            aria-label="Shuvo Molla - Back to top"
          >
            Shuvo Molla
          </a>

          {/* Desktop Nav Links */}
          <nav aria-label="Primary" className="hidden-mobile">
            <ul role="list" style={{ display: 'flex', gap: '2px', listStyle: 'none', alignItems: 'center' }}>
              {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.href.slice(1);
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      style={{
                        padding: '0.4rem 0.75rem',
                        borderRadius: 'var(--radius-pill)',
                        fontSize: '0.815rem',
                        fontWeight: 600, /* Fixed font weight prevents width shifts & jitter */
                        color: isActive ? 'var(--fg)' : 'var(--fg-muted)',
                        backgroundColor: isActive ? 'var(--bg-elevated)' : 'transparent',
                        textDecoration: 'none',
                        transition: 'color 0.15s ease, background-color 0.15s ease',
                        display: 'block',
                        whiteSpace: 'nowrap',
                      }}
                      aria-current={isActive ? 'location' : undefined}
                    >
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Separator */}
          <div className="hidden-mobile" style={{ width: '1px', height: '18px', backgroundColor: 'var(--border)', margin: '0 0.35rem' }} />

          {/* Direct CTA */}
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
            className="btn-island btn-island-primary hidden-mobile"
            style={{ padding: '0.35rem 0.4rem 0.35rem 0.95rem', fontSize: '0.785rem' }}
          >
            <span>Connect</span>
            <span className="btn-island-icon" style={{ width: '24px', height: '24px' }}>
              <ArrowUpRight size={12} />
            </span>
          </a>

          {/* Light / Dark Mode Toggle with Fluid Physics */}
          <motion.button
            onClick={toggleTheme}
            whileTap={{ scale: 0.86 }}
            whileHover={{ scale: 1.08 }}
            title={theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
            aria-label={theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
            className="btn btn-ghost"
            style={{
              padding: 0,
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {theme === 'dark' ? (
                <motion.span
                  key="sun"
                  initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 22 }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Sun size={15} />
                </motion.span>
              ) : (
                <motion.span
                  key="moon"
                  initial={{ rotate: 90, scale: 0.5, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: -90, scale: 0.5, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 22 }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Moon size={15} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            className="btn btn-ghost visible-mobile-only"
            style={{ padding: '0.45rem', width: '32px', height: '32px', borderRadius: '50%', display: 'none' }}
          >
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              top: '4.5rem',
              left: '1rem',
              right: '1rem',
              zIndex: 99,
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-outer)',
              padding: '1.25rem',
              boxShadow: 'var(--shadow-float)',
            }}
          >
            <ul role="list" style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1rem' }}>
              {[...NAV_LINKS, { label: 'Contact', href: '#contact' }].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    style={{
                      display: 'block',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '12px',
                      color: activeSection === link.href.slice(1) ? 'var(--fg)' : 'var(--fg-muted)',
                      backgroundColor: activeSection === link.href.slice(1) ? 'var(--bg-elevated)' : 'transparent',
                      fontWeight: 600,
                      textDecoration: 'none',
                      fontSize: '0.925rem',
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
        @media (max-width: 900px) {
          .hidden-mobile { display: none !important; }
          .visible-mobile-only { display: flex !important; }
        }
      `}</style>
    </>
  );
}
