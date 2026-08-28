'use client';

import Link from 'next/link';
import { ArrowUp, Heart, Mail, MapPin } from 'lucide-react';
import { FiLinkedin, FiFacebook } from 'react-icons/fi';
import type { Profile } from '@/types/portfolio';

interface FooterSectionProps {
  profile?: Profile;
}

export function FooterSection({ profile }: FooterSectionProps) {
  const year = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Experience', href: '#experience' },
    { label: 'Research', href: '#research' },
    { label: 'Milestones', href: '#achievements' },
    { label: 'Education', href: '#education' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <footer
      role="contentinfo"
      className="bg-grid-pattern"
      style={{
        borderTop: '1px solid var(--border)',
        backgroundColor: 'var(--bg-card)',
        paddingTop: '3.5rem',
        paddingBottom: '2.5rem',
        position: 'relative',
      }}
    >
      <div className="container">
        
        {/* Main Footer Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2.5rem',
            paddingBottom: '2.5rem',
            borderBottom: '1px solid var(--border)',
            alignItems: 'start',
          }}
        >
          {/* Brand & Bio Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--fg)', letterSpacing: '-0.02em' }}>
                {profile?.name || 'Shuvo Molla'}
              </span>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: 'var(--accent)',
                  padding: '0.15rem 0.5rem',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: 'var(--accent-subtle)',
                  border: '1px solid var(--accent-border)',
                }}
              >
                Social Researcher
              </span>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--fg-muted)', lineHeight: 1.6, maxWidth: '380px', margin: 0 }}>
              Sociology & Social Work undergraduate focused on empirical data modeling, char community studies, and youth development.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', color: 'var(--fg-muted)' }}>
              <MapPin size={13} style={{ color: 'var(--accent)' }} />
              <span>Gono Bishwabidyalay · Savar, Dhaka</span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div>
            <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--fg)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.85rem' }}>
              Portfolio Navigation
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.5rem 1.5rem',
              }}
            >
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="footer-nav-link"
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--fg-muted)',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease, transform 0.2s ease',
                    display: 'inline-block',
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Social Channels & Contact Action */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--fg)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
              Connect & Channels
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
              {profile?.socialLinks?.linkedin && (
                <a
                  href={profile.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
                >
                  <FiLinkedin size={14} />
                  <span>LinkedIn</span>
                </a>
              )}

              {profile?.socialLinks?.facebook && (
                <a
                  href={profile.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
                >
                  <FiFacebook size={14} />
                  <span>Facebook</span>
                </a>
              )}

              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="btn btn-secondary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
                >
                  <Mail size={13} style={{ color: 'var(--accent)' }} />
                  <span>Email</span>
                </a>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Bar with Copyright & Back to Top */}
        <div
          style={{
            paddingTop: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <p style={{ fontSize: '0.8rem', color: 'var(--fg-muted)', margin: 0 }}>
            © {year} {profile?.name || 'Shuvo Molla'}. Built with Next.js & TypeScript.
          </p>

          <button
            onClick={scrollToTop}
            className="btn btn-secondary group"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontSize: '0.8rem',
              padding: '0.45rem 0.95rem',
            }}
            aria-label="Scroll back to top"
          >
            <span>Back to Top</span>
            <ArrowUp size={13} className="transition-transform duration-200 group-hover:-translate-y-0.5" />
          </button>
        </div>

      </div>

      <style>{`
        .footer-nav-link:hover {
          color: var(--accent) !important;
          transform: translateX(2px);
        }
      `}</style>
    </footer>
  );
}
