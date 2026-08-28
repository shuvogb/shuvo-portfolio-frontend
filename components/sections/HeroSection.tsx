'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ArrowUpRight, BookOpen, FlaskConical, Calendar, FileText, Users } from 'lucide-react';
import { SectionBadge } from '@/components/ui/SectionBadge';
import type { Profile } from '@/types/portfolio';

interface HeroSectionProps {
  profile?: Profile;
  isLoading: boolean;
}

function Portrait3DCard({
  avatarSrc,
  name,
  isLoading,
}: {
  avatarSrc?: string;
  name?: string;
  isLoading?: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 240, damping: 22 });
  const mouseYSpring = useSpring(y, { stiffness: 240, damping: 22 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['8deg', '-8deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-8deg', '8deg']);

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
    <div style={{ perspective: '1200px', width: '100%', maxWidth: '300px' }}>
      {/* Main 3D Tilt Portrait Card with smooth floating motion */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
          }}
          whileHover={{ scale: 1.02 }}
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
                backgroundColor: 'var(--bg-elevated)',
              }}
            >
              {isLoading || !avatarSrc ? (
                <div className="skeleton" style={{ width: '100%', height: '100%' }} />
              ) : (
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
              )}
            </div>
          </div>
        </motion.div>
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
  const avatarSrc = profile?.avatarUrl || (!isLoading ? '/images/shuvo.png' : undefined);

  const statusBadgeText =
    profile?.statusBadge || 'Open for Research & Community Initiatives';

  const stats = {
    events: {
      value: profile?.heroStats?.events?.value || '20+',
      label: profile?.heroStats?.events?.label || 'Events Organized',
      sublabel: profile?.heroStats?.events?.sublabel || 'Youth & Academic',
      icon: Calendar,
    },
    papers: {
      value: profile?.heroStats?.papers?.value || '2',
      label: profile?.heroStats?.papers?.label || 'Academic Papers',
      sublabel: profile?.heroStats?.papers?.sublabel || 'Published / Review',
      icon: FileText,
    },
    reach: {
      value: profile?.heroStats?.reach?.value || '100+',
      label: profile?.heroStats?.reach?.label || 'Fieldwork Reach',
      sublabel: profile?.heroStats?.reach?.sublabel || 'Char Communities',
      icon: Users,
    },
  };

  const primaryCta = profile?.primaryCta || {
    label: 'Get in Touch',
    link: '#contact',
  };

  const secondaryCta = profile?.secondaryCta || {
    label: 'Publications',
    link: '#publications',
  };

  const handleCtaClick = (link: string) => {
    if (link.startsWith('#')) {
      const targetId = link.replace('#', '');
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

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
          
          {/* Left Column: Academic Thesis & Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          >
            {/* Reusable SectionBadge */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
              <SectionBadge icon={<FlaskConical size={13} />} style={{ marginBottom: 0 }}>
                {statusBadgeText}
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

            {/* Subtitle / Focus */}
            <h2
              style={{
                fontSize: 'clamp(1.15rem, 2.2vw, 1.35rem)',
                fontWeight: 700,
                color: 'var(--accent)',
                letterSpacing: '-0.015em',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
              }}
            >
              {isLoading ? (
                <span className="skeleton" style={{ display: 'block', height: '24px', width: '280px' }} />
              ) : (
                profile?.headline || 'Sociology & Social Work Undergraduate — Social Research · Community Development'
              )}
            </h2>

            {/* Bio summary */}
            <p
              style={{
                fontSize: '1rem',
                lineHeight: 1.7,
                color: 'var(--fg-muted)',
                marginBottom: '2rem',
                maxWidth: '520px',
              }}
            >
              {isLoading ? (
                <>
                  <span className="skeleton" style={{ display: 'block', height: '16px', width: '100%', marginBottom: '0.5rem' }} />
                  <span className="skeleton" style={{ display: 'block', height: '16px', width: '75%' }} />
                </>
              ) : (
                profile?.summary ||
                'Undergraduate researcher with hands-on experience in quantitative social methods (SPSS), char community studies, and youth development initiatives.'
              )}
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', alignItems: 'center' }}>
              <button
                onClick={() => handleCtaClick(primaryCta.link)}
                className="btn-island btn-island-primary"
                aria-label={`Action: ${primaryCta.label}`}
              >
                <span>{primaryCta.label}</span>
                <span className="btn-island-icon">
                  <ArrowUpRight size={14} />
                </span>
              </button>

              <button
                onClick={() => handleCtaClick(secondaryCta.link)}
                className="btn-island btn-island-secondary"
                aria-label={`Action: ${secondaryCta.label}`}
              >
                <span>{secondaryCta.label}</span>
                <span className="btn-island-icon">
                  <BookOpen size={14} />
                </span>
              </button>
            </div>
          </motion.div>

          {/* Right Column: 3-Side Floating Stats Surrounding User's Portrait (Zero Overlap) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.32, 0.72, 0, 1] }}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <div className="hero-portrait-stage">
              
              {/* SIDE 1: Left Floating Stat Card */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
                className="stat-side-left"
              >
                <div className="stat-pill-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div className="stat-pill-icon">
                      <stats.events.icon size={14} strokeWidth={1.8} />
                    </div>
                    <div>
                      <p className="stat-pill-value">{stats.events.value}</p>
                      <p className="stat-pill-label">{stats.events.label}</p>
                      <p className="stat-pill-sublabel">{stats.events.sublabel}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* CENTER: Unobstructed 3D Tilt Portrait */}
              <Portrait3DCard avatarSrc={avatarSrc} name={profile?.name} isLoading={isLoading} />

              {/* SIDE 2: Right Floating Stat Card */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                className="stat-side-right"
              >
                <div className="stat-pill-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div className="stat-pill-icon">
                      <stats.papers.icon size={14} strokeWidth={1.8} />
                    </div>
                    <div>
                      <p className="stat-pill-value">{stats.papers.value}</p>
                      <p className="stat-pill-label">{stats.papers.label}</p>
                      <p className="stat-pill-sublabel">{stats.papers.sublabel}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* SIDE 3: Bottom Floating Stat Card */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                className="stat-side-bottom"
              >
                <div className="stat-pill-card stat-pill-bottom">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div className="stat-pill-icon">
                      <stats.reach.icon size={14} strokeWidth={1.8} />
                    </div>
                    <div>
                      <p className="stat-pill-value">{stats.reach.value}</p>
                      <p className="stat-pill-label">{stats.reach.label}</p>
                      <p className="stat-pill-sublabel">{stats.reach.sublabel}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>

      <style>{`
        .hero-portrait-stage {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          max-width: 320px;
          margin: 1.5rem auto 2.5rem;
        }

        /* ─── 3-Side Floating Positions (Zero Overlap on Image) ─── */
        .stat-side-left {
          position: absolute;
          left: -110px;
          top: 30%;
          transform: translateY(-50%);
          z-index: 25;
        }

        .stat-side-right {
          position: absolute;
          right: -110px;
          top: 20%;
          transform: translateY(-50%);
          z-index: 25;
        }

        .stat-side-bottom {
          position: absolute;
          bottom: -28px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 25;
        }

        .stat-pill-card {
          padding: 0.65rem 0.95rem;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-strong);
          border-radius: 16px;
          box-shadow: 0 16px 36px -4px rgba(0, 0, 0, 0.18), 0 4px 12px rgba(0, 0, 0, 0.08);
          white-space: nowrap;
        }

        .stat-pill-bottom {
          min-width: 200px;
        }

        .stat-pill-icon {
          width: 32px;
          height: 32px;
          border-radius: 9px;
          background-color: var(--accent-subtle);
          color: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-pill-value {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--fg);
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin: 0;
        }

        .stat-pill-label {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--fg);
          line-height: 1.2;
          margin: 0.15rem 0 0 0;
        }

        .stat-pill-sublabel {
          font-size: 0.65rem;
          color: var(--fg-muted);
          line-height: 1.1;
          margin: 0.1rem 0 0 0;
        }

        @media (max-width: 900px) {
          .stat-side-left {
            left: -30px;
            top: 25%;
          }
          .stat-side-right {
            right: -30px;
            top: 15%;
          }
          .stat-side-bottom {
            bottom: -20px;
          }
        }

        @media (max-width: 640px) {
          .stat-side-left, .stat-side-right, .stat-side-bottom {
            position: static;
            transform: none;
            margin: 0.5rem 0;
          }
          .hero-portrait-stage {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>
    </section>
  );
}
