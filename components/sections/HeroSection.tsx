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

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['6deg', '-6deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-6deg', '6deg']);

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
    <div className="portrait-frame-wrapper">
      {/* Outer Blue Accent Halo Outline (Matches Reference) */}
      <div className="portrait-blue-halo" />

      {/* Main 3D Tilt Portrait Card with subtle floating motion */}
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ width: '100%', display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 5 }}
      >
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
            width: '100%',
          }}
          whileHover={{ scale: 1.015 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="portrait-white-card"
        >
          <div className="portrait-photo-box">
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
        </motion.div>
      </motion.div>
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
      className="bg-grid-pattern hero-section"
      style={{
        minHeight: '92vh',
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="container" style={{ width: '100%' }}>
        <div className="hero-layout-grid">

          {/* Left Column: Academic Thesis & Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            className="hero-text-column"
          >
            {/* Reusable SectionBadge / Skeleton */}
            {isLoading ? (
              <div className="skeleton-pill" style={{ width: '280px', height: '32px', marginBottom: '1.5rem' }} />
            ) : (
              <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
                <SectionBadge icon={<FlaskConical size={13} />} style={{ marginBottom: 0 }}>
                  {statusBadgeText}
                </SectionBadge>
              </div>
            )}

            {/* Name */}
            <h1
              className="hero-title"
              style={{
                fontWeight: 800,
                letterSpacing: '-0.04em',
                lineHeight: 1.06,
                marginBottom: '0.75rem',
                color: 'var(--fg)',
              }}
            >
              {isLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <span className="skeleton" style={{ display: 'block', height: '56px', width: '360px', borderRadius: '10px' }} />
                </div>
              ) : (
                profile?.name || 'Shuvo Molla'
              )}
            </h1>

            {/* Subtitle / Focus */}
            <h2
              className="hero-subtitle"
              style={{
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
                <span className="skeleton" style={{ display: 'block', height: '24px', width: '380px', borderRadius: '8px' }} />
              ) : (
                profile?.headline || 'Sociology & Social Work Undergraduate — Social Research · Community Development'
              )}
            </h2>

            {/* Bio summary */}
            <div
              style={{
                fontSize: '1rem',
                lineHeight: 1.7,
                color: 'var(--fg-muted)',
                marginBottom: '2rem',
                maxWidth: '520px',
              }}
            >
              {isLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <span className="skeleton" style={{ display: 'block', height: '16px', width: '100%', borderRadius: '6px' }} />
                  <span className="skeleton" style={{ display: 'block', height: '16px', width: '92%', borderRadius: '6px' }} />
                  <span className="skeleton" style={{ display: 'block', height: '16px', width: '70%', borderRadius: '6px' }} />
                </div>
              ) : (
                <p style={{ margin: 0 }}>
                  {profile?.summary ||
                    'Undergraduate researcher with hands-on experience in quantitative social methods (SPSS), char community studies, and youth development initiatives.'}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            {isLoading ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', alignItems: 'center' }}>
                <div className="skeleton-pill" style={{ height: '44px', width: '145px' }} />
                <div className="skeleton-pill" style={{ height: '44px', width: '155px' }} />
              </div>
            ) : (
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
            )}
          </motion.div>

          {/* Right Column: Hero Portrait with Exact 3-Badge Floating Layout for All Devices */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.32, 0.72, 0, 1] }}
            className="hero-visual-column"
          >
            <div className="hero-portrait-stage">

              {/* Stat 1: Left Badge (Events Organized) */}
              <div className="stat-pill-item stat-item-left">
                <div className="stat-pill-card">
                  {isLoading ? (
                    <div className="stat-skeleton">
                      <div className="skeleton" style={{ width: '30px', height: '30px', borderRadius: '9px', flexShrink: 0 }} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div className="skeleton" style={{ height: '14px', width: '38px', borderRadius: '4px' }} />
                        <div className="skeleton" style={{ height: '10px', width: '65px', borderRadius: '4px' }} />
                      </div>
                    </div>
                  ) : (
                    <div className="stat-content">
                      <div className="stat-pill-icon">
                        <stats.events.icon size={15} strokeWidth={2} />
                      </div>
                      <div className="stat-text-group">
                        <p className="stat-pill-value">{stats.events.value}</p>
                        <p className="stat-pill-label">{stats.events.label}</p>
                        <p className="stat-pill-sublabel">{stats.events.sublabel}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* CENTER: 3D Tilt Portrait Frame with Accent Blue Halo */}
              <div className="hero-portrait-frame">
                <Portrait3DCard avatarSrc={avatarSrc} name={profile?.name} isLoading={isLoading} />
              </div>

              {/* Stat 2: Top-Right Badge (Academic Papers) */}
              <div className="stat-pill-item stat-item-right">
                <div className="stat-pill-card">
                  {isLoading ? (
                    <div className="stat-skeleton">
                      <div className="skeleton" style={{ width: '30px', height: '30px', borderRadius: '9px', flexShrink: 0 }} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div className="skeleton" style={{ height: '14px', width: '38px', borderRadius: '4px' }} />
                        <div className="skeleton" style={{ height: '10px', width: '65px', borderRadius: '4px' }} />
                      </div>
                    </div>
                  ) : (
                    <div className="stat-content">
                      <div className="stat-pill-icon">
                        <stats.papers.icon size={15} strokeWidth={2} />
                      </div>
                      <div className="stat-text-group">
                        <p className="stat-pill-value">{stats.papers.value}</p>
                        <p className="stat-pill-label">{stats.papers.label}</p>
                        <p className="stat-pill-sublabel">{stats.papers.sublabel}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Stat 3: Bottom-Right Badge (Fieldwork Reach) */}
              <div className="stat-pill-item stat-item-bottom">
                <div className="stat-pill-card">
                  {isLoading ? (
                    <div className="stat-skeleton">
                      <div className="skeleton" style={{ width: '30px', height: '30px', borderRadius: '9px', flexShrink: 0 }} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div className="skeleton" style={{ height: '14px', width: '38px', borderRadius: '4px' }} />
                        <div className="skeleton" style={{ height: '10px', width: '65px', borderRadius: '4px' }} />
                      </div>
                    </div>
                  ) : (
                    <div className="stat-content">
                      <div className="stat-pill-icon">
                        <stats.reach.icon size={15} strokeWidth={2} />
                      </div>
                      <div className="stat-text-group">
                        <p className="stat-pill-value">{stats.reach.value}</p>
                        <p className="stat-pill-label">{stats.reach.label}</p>
                        <p className="stat-pill-sublabel">{stats.reach.sublabel}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>

      <style>{`
        /* ─── Hero Base & Typography ─── */
        .hero-section {
          padding-top: 7.5rem;
          padding-bottom: 5.5rem;
          overflow: hidden;
        }

        .hero-title {
          font-size: clamp(2.5rem, 5.2vw, 4.25rem);
        }

        .hero-subtitle {
          font-size: clamp(1.05rem, 2vw, 1.35rem);
        }

        /* ─── Hero Layout Grid ─── */
        .hero-layout-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 3.5rem;
          align-items: center;
          width: 100%;
        }

        .hero-visual-column {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
        }

        /* ─── Stage Container for All Devices ─── */
        .hero-portrait-stage {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          max-width: 300px;
          margin: 1.5rem auto 2.5rem;
        }

        .hero-portrait-frame {
          position: relative;
          z-index: 10;
          display: flex;
          justify-content: center;
          width: 100%;
        }

        .portrait-frame-wrapper {
          position: relative;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        /* Outer Blue Accent Halo Outline (Matches Reference Exact Frame) */
        .portrait-blue-halo {
          position: absolute;
          inset: -10px;
          border-radius: 30px;
          border: 2px solid rgba(59, 130, 246, 0.75);
          box-shadow: 0 0 24px -2px rgba(59, 130, 246, 0.25);
          pointer-events: none;
          z-index: 1;
        }

        /* Inner White Machined Card */
        .portrait-white-card {
          width: 100%;
          cursor: pointer;
          border-radius: 22px;
          padding: 8px;
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.08);
          box-shadow: 0 16px 36px -6px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.04);
          position: relative;
          z-index: 5;
        }

        .dark .portrait-white-card {
          background: #0e121b;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 16px 36px -6px rgba(0, 0, 0, 0.5);
        }

        /* Photo Box Inside */
        .portrait-photo-box {
          width: 100%;
          aspect-ratio: 1 / 1.15;
          border-radius: 16px;
          overflow: hidden;
          position: relative;
          background-color: var(--bg-elevated);
        }

        /* ─── Floating Stat Badges (Generous Spacing / Distanced from Center) ─── */
        .stat-pill-item {
          position: absolute;
          z-index: 25;
          pointer-events: auto;
        }

        /* 1. Left Badge: Events Organized (Distanced to the left, clear of face) */
        .stat-item-left {
          left: -100px;
          top: 48%;
          transform: translateY(-50%);
          animation: badgeFloatLeft 4.6s ease-in-out infinite;
        }

        /* 2. Top-Right Badge: Academic Papers (Distanced to the upper right, clear of head) */
        .stat-item-right {
          right: -90px;
          top: 16%;
          transform: translateY(-50%);
          animation: badgeFloatRight 4.2s ease-in-out infinite 0.6s;
        }

        /* 3. Bottom-Right Badge: Fieldwork Reach (Distanced to bottom right) */
        .stat-item-bottom {
          right: -36px;
          bottom: -26px;
          animation: badgeFloatBottom 4.8s ease-in-out infinite 1.2s;
        }

        /* ─── Stat Pill Card Look & Feel (Compact & Refined) ─── */
        .stat-pill-card {
          padding: 0.52rem 0.85rem;
          background-color: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 15px;
          box-shadow: 0 12px 28px -4px rgba(0, 0, 0, 0.12), 0 3px 10px rgba(0, 0, 0, 0.04);
          white-space: nowrap;
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          transition: transform 0.25s cubic-bezier(0.32, 0.72, 0, 1), 
                      border-color 0.25s cubic-bezier(0.32, 0.72, 0, 1), 
                      box-shadow 0.25s cubic-bezier(0.32, 0.72, 0, 1);
        }

        .dark .stat-pill-card {
          background-color: #0e121b;
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 12px 28px -4px rgba(0, 0, 0, 0.5);
        }

        @media (hover: hover) and (pointer: fine) {
          .stat-pill-card:hover {
            border-color: var(--accent-border);
            box-shadow: 0 16px 32px -6px rgba(59, 130, 246, 0.2), 0 5px 14px rgba(0, 0, 0, 0.1);
            transform: translateY(-2px) scale(1.02);
          }
        }

        .stat-pill-card:active {
          transform: scale(0.98);
        }

        .stat-skeleton,
        .stat-content {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .stat-pill-icon {
          width: 30px;
          height: 30px;
          border-radius: 9px;
          background-color: rgba(59, 130, 246, 0.08);
          color: #2563eb;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .dark .stat-pill-icon {
          background-color: rgba(59, 130, 246, 0.15);
          color: #60a5fa;
        }

        .stat-text-group {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .stat-pill-value {
          font-size: 1.02rem;
          font-weight: 800;
          color: var(--fg);
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin: 0;
        }

        .stat-pill-label {
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--fg);
          line-height: 1.2;
          margin: 0.1rem 0 0 0;
        }

        .stat-pill-sublabel {
          font-size: 0.6rem;
          font-weight: 500;
          color: var(--fg-muted);
          line-height: 1.1;
          margin: 0.05rem 0 0 0;
        }

        /* ─── Ambient Float Keyframes ─── */
        @keyframes badgeFloatLeft {
          0%, 100% { transform: translateY(-50%) translateY(0); }
          50% { transform: translateY(-50%) translateY(-5px); }
        }

        @keyframes badgeFloatRight {
          0%, 100% { transform: translateY(-50%) translateY(0); }
          50% { transform: translateY(-50%) translateY(5px); }
        }

        @keyframes badgeFloatBottom {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        /* ─── Tablet (768px - 1023px) ─── */
        @media (max-width: 1023px) {
          .hero-section {
            padding-top: 5.5rem;
            padding-bottom: 3.5rem;
          }

          .hero-layout-grid {
            grid-template-columns: 1fr;
            gap: 2.75rem;
          }

          .hero-portrait-stage {
            max-width: 270px;
            margin: 1.5rem auto 2.5rem;
          }

          .stat-item-left {
            left: -95px;
            top: 48%;
          }

          .stat-item-right {
            right: -82px;
            top: 16%;
          }

          .stat-item-bottom {
            right: -28px;
            bottom: -20px;
          }

          .stat-pill-card {
            padding: 0.45rem 0.72rem;
          }

          .stat-pill-icon {
            width: 27px;
            height: 27px;
            border-radius: 8px;
          }

          .stat-pill-value {
            font-size: 0.94rem;
          }

          .stat-pill-label {
            font-size: 0.65rem;
          }

          .stat-pill-sublabel {
            font-size: 0.56rem;
          }
        }

        /* ─── Mobile (380px - 767px) ─── */
        @media (max-width: 767px) {
          .hero-portrait-stage {
            max-width: 230px;
            margin: 1.25rem auto 2.25rem;
          }

          .portrait-blue-halo {
            inset: -8px;
            border-radius: 26px;
          }

          .portrait-white-card {
            padding: 6px;
            border-radius: 18px;
          }

          .portrait-photo-box {
            border-radius: 13px;
          }

          /* 1st stat pushed more left */
          .stat-item-left {
            left: -82px;
            top: 48%;
          }

          /* 2nd stat pushed more right */
          .stat-item-right {
            right: -78px;
            top: 16%;
          }

          .stat-item-bottom {
            right: -28px;
            bottom: -20px;
          }

          .stat-pill-card {
            padding: 0.4rem 0.62rem;
            border-radius: 13px;
          }

          .stat-pill-icon {
            width: 24px;
            height: 24px;
            border-radius: 7px;
          }

          .stat-pill-value {
            font-size: 0.86rem;
          }

          .stat-pill-label {
            font-size: 0.6rem;
          }

          .stat-pill-sublabel {
            font-size: 0.52rem;
          }
        }

        /* ─── Extra Small Mobile (< 380px, e.g. iPhone SE) ─── */
        @media (max-width: 379px) {
          .hero-portrait-stage {
            max-width: 200px;
            margin: 1rem auto 2rem;
          }

          .portrait-blue-halo {
            inset: -7px;
            border-radius: 24px;
          }

          /* 1st stat pushed more left */
          .stat-item-left {
            left: -68px;
            top: 48%;
          }

          /* 2nd stat pushed more right */
          .stat-item-right {
            right: -64px;
            top: 16%;
          }

          .stat-item-bottom {
            right: -20px;
            bottom: -16px;
          }

          .stat-pill-card {
            padding: 0.35rem 0.52rem;
            border-radius: 11px;
          }

          .stat-pill-icon {
            width: 22px;
            height: 22px;
            border-radius: 6px;
          }

          .stat-pill-value {
            font-size: 0.8rem;
          }

          .stat-pill-label {
            font-size: 0.56rem;
          }

          .stat-pill-sublabel {
            font-size: 0.48rem;
          }
        }
      `}</style>
    </section>
  );
}
