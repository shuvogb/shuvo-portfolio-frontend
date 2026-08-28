'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ArrowUpRight, BookOpen, FlaskConical } from 'lucide-react';
import { SectionBadge } from '@/components/ui/SectionBadge';
import type { Profile } from '@/types/portfolio';

interface HeroSectionProps {
  profile?: Profile;
  isLoading: boolean;
}

function Portrait3DCard({ avatarSrc, name }: { avatarSrc: string; name?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 240, damping: 22 });
  const mouseYSpring = useSpring(y, { stiffness: 240, damping: 22 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['10deg', '-10deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-10deg', '10deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div style={{ perspective: '1200px', width: '100%', maxWidth: '320px' }}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{ scale: 1.03 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="bezel-card portrait-3d-card"
      >
        <div
          className="bezel-core"
          style={{
            padding: '6px',
            borderRadius: '18px',
            overflow: 'hidden',
            position: 'relative',
            transform: 'translateZ(20px)',
          }}
        >
          <div
            style={{
              width: '100%',
              aspectRatio: '1 / 1.15',
              borderRadius: '14px',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <img
              src={avatarSrc}
              alt={name || 'Shuvo Molla'}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 20%',
                display: 'block',
              }}
            />
          </div>
        </div>
      </motion.div>

      <style>{`
        .portrait-3d-card {
          width: 100%;
          cursor: pointer;
          border-radius: 24px;
          padding: 6px;
          position: relative;
          transition: box-shadow 0.35s ease, border-color 0.35s ease;
        }
        .portrait-3d-card:hover {
          border-color: var(--accent) !important;
          box-shadow: 0 0 35px -2px var(--accent-border), 0 20px 40px -10px rgba(0, 0, 0, 0.35) !important;
        }
      `}</style>
    </div>
  );
}

export function HeroSection({ profile, isLoading }: HeroSectionProps) {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };
  const scrollToResearch = () => {
    document.getElementById('research')?.scrollIntoView({ behavior: 'smooth' });
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
        paddingTop: '7.5rem',
        paddingBottom: '5.5rem',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          
          {/* Left Column: Academic Thesis & Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          >
            {/* Reusable SectionBadge */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
              <SectionBadge icon={<FlaskConical size={13} />} style={{ marginBottom: 0 }}>
                Open for Research & Community Initiatives
              </SectionBadge>
            </div>

            {/* Name */}
            <h1
              style={{
                fontSize: 'clamp(2.75rem, 5.5vw, 4.25rem)',
                fontWeight: 800,
                letterSpacing: '-0.04em',
                lineHeight: 1.06,
                marginBottom: '0.75rem',
                color: 'var(--fg)',
              }}
            >
              {isLoading ? (
                <span className="skeleton" style={{ display: 'block', height: '60px', width: '340px' }} />
              ) : (
                profile?.name || 'Shuvo Molla'
              )}
            </h1>

            {/* Sub-Headline */}
            <p
              style={{
                fontSize: 'clamp(1.1rem, 2vw, 1.25rem)',
                fontWeight: 600,
                color: 'var(--accent)',
                lineHeight: 1.4,
                marginBottom: '1.25rem',
              }}
            >
              Sociology & Social Work Researcher
            </p>

            {/* Concise Summary */}
            <p
              style={{
                fontSize: '1rem',
                lineHeight: 1.8,
                color: 'var(--fg-muted)',
                marginBottom: '2rem',
                maxWidth: '520px',
              }}
            >
              {isLoading ? (
                <>
                  <span className="skeleton" style={{ display: 'block', height: '16px', marginBottom: '8px' }} />
                  <span className="skeleton" style={{ display: 'block', height: '16px', width: '75%' }} />
                </>
              ) : (
                'Undergraduate researcher with hands-on experience in quantitative social methods (SPSS), char community studies, and youth development initiatives.'
              )}
            </p>

            {/* Action Buttons */}
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
            </div>

            {/* Structured Bento Metrics */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.85rem',
                marginTop: '2.5rem',
                paddingTop: '1.75rem',
                borderTop: '1px solid var(--border)',
              }}
            >
              {[
                { value: '20+', label: 'Events Organized' },
                { value: '2', label: 'Peer-Reviewed Papers' },
                { value: '100+', label: 'Fieldwork Reach' },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '14px',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--fg)', lineHeight: 1, letterSpacing: '-0.03em' }}>
                    {value}
                  </p>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--fg-muted)', marginTop: '0.35rem', lineHeight: 1.25 }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Interactive 3D Parallax Tilt Portrait Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.32, 0.72, 0, 1] }}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <Portrait3DCard avatarSrc={avatarSrc} name={profile?.name} />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
