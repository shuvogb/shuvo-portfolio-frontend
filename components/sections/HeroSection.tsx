'use client';

import { motion } from 'motion/react';
import { MapPin, Mail, ArrowDown, ArrowUpRight } from 'lucide-react';
import type { Profile } from '@/types/portfolio';

interface HeroSectionProps {
  profile?: Profile;
  isLoading: boolean;
}

export function HeroSection({ profile, isLoading }: HeroSectionProps) {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };
  const scrollToResearch = () => {
    document.getElementById('research')?.scrollIntoView({ behavior: 'smooth' });
  };
  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      aria-label="Introduction"
      style={{
        minHeight: '92vh',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '6rem',
        paddingBottom: '4rem',
        borderBottom: '1px solid var(--border)',
        backgroundColor: 'var(--background)',
      }}
    >
      <div className="container">
        <div style={{ maxWidth: '820px' }}>
          
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ marginBottom: '1.25rem' }}
          >
            <span className="badge badge-primary">
              Social Research · Community Development · Climate Action
            </span>
          </motion.div>

          {/* Name Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              marginBottom: '1rem',
              color: 'var(--foreground)',
              fontWeight: 800,
              letterSpacing: '-0.035em',
            }}
          >
            {isLoading ? (
              <span className="skeleton" style={{ display: 'block', height: '64px', width: '320px' }} />
            ) : (
              profile?.name || 'Shuvo Molla'
            )}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            style={{
              fontSize: 'clamp(1.15rem, 2.2vw, 1.35rem)',
              fontWeight: 500,
              color: 'var(--foreground)',
              marginBottom: '1.5rem',
              lineHeight: 1.5,
            }}
          >
            {isLoading ? (
              <span className="skeleton" style={{ display: 'block', height: '24px', width: '450px' }} />
            ) : (
              profile?.headline || 'Sociology & Social Work Undergraduate'
            )}
          </motion.p>

          {/* Summary */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              fontSize: '1rem',
              lineHeight: 1.8,
              color: 'var(--muted-foreground)',
              marginBottom: '2rem',
              maxWidth: '680px',
            }}
          >
            {isLoading ? (
              <>
                <span className="skeleton" style={{ display: 'block', height: '16px', marginBottom: '8px' }} />
                <span className="skeleton" style={{ display: 'block', height: '16px', marginBottom: '8px', width: '85%' }} />
                <span className="skeleton" style={{ display: 'block', height: '16px', width: '60%' }} />
              </>
            ) : (
              profile?.summary
            )}
          </motion.p>

          {/* Quick contact / location info */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1.5rem',
              marginBottom: '2.5rem',
              fontSize: '0.85rem',
              color: 'var(--muted-foreground)',
            }}
          >
            {profile?.presentAddress && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={15} style={{ color: 'var(--primary)' }} />
                {profile.presentAddress}
              </span>
            )}
            {profile?.email && (
              <a
                href={`mailto:${profile.email}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                <Mail size={15} style={{ color: 'var(--primary)' }} />
                {profile.email}
              </a>
            )}
          </motion.div>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}
          >
            <button
              onClick={scrollToContact}
              className="btn btn-primary"
              aria-label="Contact Shuvo Molla"
            >
              Get in Touch
            </button>
            <button
              onClick={scrollToResearch}
              className="btn btn-secondary"
              aria-label="View Research Publications"
            >
              View Research <ArrowUpRight size={15} />
            </button>
            <button
              onClick={scrollToAbout}
              className="btn btn-ghost"
              aria-label="Read Full Background"
            >
              Learn More <ArrowDown size={14} />
            </button>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
