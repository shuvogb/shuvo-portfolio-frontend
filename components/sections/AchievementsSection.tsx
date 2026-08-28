'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Trophy, ArrowUpRight } from 'lucide-react';
import { SectionBadge } from '@/components/ui/SectionBadge';
import { getAchievementDetails } from '@/lib/achievementsData';
import type { Achievement, Profile } from '@/types/portfolio';

interface AchievementsSectionProps {
  achievements?: Achievement[];
  profile?: Profile;
  isLoading: boolean;
}

export function AchievementsSection({ achievements = [], profile, isLoading }: AchievementsSectionProps) {
  const achConfig = profile?.achievementsSection;
  const sectionBadge = achConfig?.badge || 'Impact & Milestones';
  const sectionTitle = achConfig?.title || 'Key Achievements';
  const sectionDesc =
    achConfig?.description ||
    'Quantifiable leadership results, community development initiatives, and student organization stewardship. Click any card to view the dedicated field story.';

  return (
    <section id="achievements" className="section bg-grid-pattern" aria-label="Key Achievements & Milestones">
      <div className="container">
        
        {/* Header */}
        <div className="section-header">
          <SectionBadge icon={<Trophy size={13} strokeWidth={1.75} />}>
            {sectionBadge}
          </SectionBadge>
          <h2 className="section-title">{sectionTitle}</h2>
          <p className="section-description">
            {sectionDesc}
          </p>
        </div>

        {/* Image & Card Based Grid with Framed Padding */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bezel-card">
                  <div className="bezel-core" style={{ padding: '0.85rem', display: 'flex', flexDirection: 'column', height: '100%', gap: '0.75rem' }}>
                    {/* Top Framed Image Skeleton */}
                    <div className="skeleton" style={{ width: '100%', height: '170px', borderRadius: '12px' }} />

                    {/* Category & Year Row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div className="skeleton-pill" style={{ height: '22px', width: '85px' }} />
                      <div className="skeleton" style={{ height: '14px', width: '40px', borderRadius: '4px' }} />
                    </div>

                    {/* Title Skeleton */}
                    <div className="skeleton" style={{ height: '18px', width: `${70 + (i % 3) * 10}%`, borderRadius: '4px' }} />

                    {/* Description Lines */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
                      <div className="skeleton" style={{ height: '13px', width: '100%', borderRadius: '4px' }} />
                      <div className="skeleton" style={{ height: '13px', width: '75%', borderRadius: '4px' }} />
                    </div>

                    {/* Link Footer */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
                      <div className="skeleton" style={{ height: '14px', width: '100px', borderRadius: '4px' }} />
                      <div className="skeleton" style={{ width: '14px', height: '14px', borderRadius: '4px' }} />
                    </div>
                  </div>
                </div>
              ))
            : achievements.map((ach, idx) => {
                const details = getAchievementDetails(ach, idx);
                const IconComponent = details.icon;

                return (
                  <motion.div
                    key={ach._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.35, delay: (idx % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={`/achievements/${ach._id}`}
                      className="bezel-card bezel-card-interactive group cursor-pointer block h-full text-inherit no-underline"
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <div
                        className="bezel-core"
                        style={{
                          padding: '0.85rem',
                          display: 'flex',
                          flexDirection: 'column',
                          height: '100%',
                        }}
                      >
                        {/* Framed Visual Image Header with Padding & Rounded Inner Corners */}
                        <div
                          style={{
                            position: 'relative',
                            height: '165px',
                            width: '100%',
                            overflow: 'hidden',
                            borderRadius: 'var(--radius-inner)',
                            backgroundColor: 'var(--bg-elevated)',
                          }}
                        >
                          <img
                            src={details.images[0]}
                            alt={details.category}
                            className="achievement-card-img"
                            loading="lazy"
                          />

                          {/* Dark Gradient Overlay */}
                          <div
                            style={{
                              position: 'absolute',
                              inset: 0,
                              background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0.3) 100%)',
                            }}
                          />

                          {/* Floating Category Badge */}
                          <div
                            style={{
                              position: 'absolute',
                              top: '10px',
                              left: '10px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              padding: '0.25rem 0.6rem',
                              borderRadius: 'var(--radius-pill)',
                              backgroundColor: 'rgba(15, 23, 42, 0.8)',
                              backdropFilter: 'blur(8px)',
                              border: '1px solid rgba(255, 255, 255, 0.15)',
                              color: '#fff',
                              fontSize: '0.725rem',
                              fontWeight: 600,
                            }}
                          >
                            <IconComponent size={12} strokeWidth={2} style={{ color: 'var(--accent)' }} />
                            <span>{details.category}</span>
                          </div>
                        </div>

                        {/* Card Content Body */}
                        <div
                          style={{
                            padding: '0.85rem 0.35rem 0.35rem',
                            display: 'flex',
                            flexDirection: 'column',
                            flex: 1,
                            justifyContent: 'space-between',
                            gap: '0.85rem',
                          }}
                        >
                          <div>
                            {/* Header Placed Outside/Below Image */}
                            <h3
                              style={{
                                fontSize: '1.05rem',
                                fontWeight: 700,
                                color: 'var(--fg)',
                                letterSpacing: '-0.015em',
                                lineHeight: 1.35,
                                marginBottom: '0.45rem',
                              }}
                            >
                              {details.highlight}
                            </h3>

                            <p
                              style={{
                                fontSize: '0.885rem',
                                lineHeight: 1.6,
                                color: 'var(--fg-muted)',
                                margin: 0,
                              }}
                            >
                              {ach.description}
                            </p>
                          </div>

                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              paddingTop: '0.65rem',
                              borderTop: '1px solid var(--border)',
                            }}
                          >
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                color: 'var(--accent)',
                              }}
                            >
                              <span>Explore Field Story</span>
                              <ArrowUpRight size={14} strokeWidth={2} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </span>

                            <span style={{ fontSize: '0.75rem', color: 'var(--fg-muted)' }}>
                              {details.images.length} {details.images.length === 1 ? 'Photo' : 'Photos'}
                            </span>
                          </div>
                        </div>

                      </div>
                    </Link>
                  </motion.div>
                );
              })}
        </div>

      </div>

      <style>{`
        .achievement-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.75s cubic-bezier(0.16, 1, 0.3, 1);
          transform: scale(1) translateZ(0);
          will-change: transform;
          backface-visibility: hidden;
        }

        .bezel-card-interactive:hover .achievement-card-img {
          transform: scale(1.06) translateZ(0);
        }
      `}</style>
    </section>
  );
}
