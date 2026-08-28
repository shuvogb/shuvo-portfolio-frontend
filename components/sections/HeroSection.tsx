'use client';

import { motion } from 'motion/react';
import { ArrowUpRight, BookOpen, ArrowDown, ShieldCheck, CheckCircle2 } from 'lucide-react';
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

  const avatarSrc = profile?.avatarUrl || '/images/shuvo.png';

  return (
    <section
      id="hero"
      aria-label="Introduction"
      className="bg-grid-pattern"
      style={{
        minHeight: '94vh',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '8rem',
        paddingBottom: '6rem',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          
          {/* Left Column: Academic Thesis & Action Islands */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          >
            {/* Status Eyebrow */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-strong)',
                  boxShadow: 'var(--shadow-sm)',
                  fontSize: '0.785rem',
                  fontWeight: 600,
                  color: 'var(--fg)',
                }}
              >
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                <span>Available for Research & Community Initiatives</span>
              </div>
            </div>

            {/* Main Headline */}
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.5rem, 5vw, 3.85rem)',
                fontWeight: 700,
                letterSpacing: '-0.025em',
                lineHeight: 1.1,
                marginBottom: '1rem',
                color: 'var(--fg)',
              }}
            >
              {isLoading ? (
                <span className="skeleton" style={{ display: 'block', height: '60px', width: '340px' }} />
              ) : (
                <>
                  {profile?.name || 'Shuvo Molla'}
                </>
              )}
            </h1>

            {/* Sub-Headline */}
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
                fontWeight: 600,
                color: 'var(--accent)',
                marginBottom: '1.25rem',
                lineHeight: 1.45,
                letterSpacing: '-0.01em',
              }}
            >
              {isLoading ? (
                <span className="skeleton" style={{ display: 'block', height: '26px', width: '420px' }} />
              ) : (
                profile?.headline || 'Sociology & Social Work Undergraduate'
              )}
            </p>

            {/* Narrative Summary */}
            <p
              style={{
                fontSize: '1rem',
                lineHeight: 1.85,
                color: 'var(--fg-muted)',
                marginBottom: '2.5rem',
                maxWidth: '560px',
              }}
            >
              {isLoading ? (
                <>
                  <span className="skeleton" style={{ display: 'block', height: '16px', marginBottom: '8px' }} />
                  <span className="skeleton" style={{ display: 'block', height: '16px', marginBottom: '8px', width: '90%' }} />
                  <span className="skeleton" style={{ display: 'block', height: '16px', width: '65%' }} />
                </>
              ) : (
                profile?.summary
              )}
            </p>

            {/* Island CTAs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', alignItems: 'center' }}>
              <button
                onClick={scrollToContact}
                className="btn-island btn-island-primary"
                aria-label="Connect with Shuvo Molla"
              >
                <span>Get in Touch</span>
                <span className="btn-island-icon">
                  <ArrowUpRight size={14} />
                </span>
              </button>

              <button
                onClick={scrollToResearch}
                className="btn-island btn-island-secondary"
                aria-label="View Research Publications"
              >
                <span>Publications</span>
                <span className="btn-island-icon">
                  <BookOpen size={14} />
                </span>
              </button>

              <button
                onClick={scrollToAbout}
                className="btn btn-ghost"
                aria-label="Explore Profile details"
              >
                Explore Bio <ArrowDown size={14} />
              </button>
            </div>

            {/* Quick Metrics Concentric Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                marginTop: '3rem',
                paddingTop: '2rem',
                borderTop: '1px solid var(--border)',
              }}
            >
              {[
                { value: '20+', label: 'Events Organized' },
                { value: '2', label: 'Peer-Reviewed Papers' },
                { value: '100+', label: 'Daily Fieldwork Reach' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--fg)', lineHeight: 1, letterSpacing: '-0.035em' }}>
                    {value}
                  </p>
                  <p className="mono" style={{ fontSize: '0.725rem', color: 'var(--fg-muted)', marginTop: '0.35rem' }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: User Portrait in Doppelrand (Double-Bezel) Enclosure */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.32, 0.72, 0, 1] }}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <div style={{ width: '100%', maxWidth: '390px' }}>
              
              {/* Outer Shell (Double-Bezel) */}
              <div className="bezel-card" style={{ position: 'relative' }}>
                
                {/* Inner Core */}
                <div
                  className="bezel-core"
                  style={{
                    padding: '0',
                    overflow: 'hidden',
                    aspectRatio: '4 / 5',
                    position: 'relative',
                  }}
                >
                  <img
                    src={avatarSrc}
                    alt={profile?.name || 'Shuvo Molla'}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                </div>

                {/* Concentric Floating Pill Badge */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-1rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-strong)',
                    borderRadius: 'var(--radius-pill)',
                    padding: '0.55rem 1.15rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    boxShadow: 'var(--shadow-float)',
                    whiteSpace: 'nowrap',
                    zIndex: 10,
                  }}
                >
                  <ShieldCheck size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--fg)' }}>
                    Published Academic Co-Author
                  </span>
                </div>

              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
