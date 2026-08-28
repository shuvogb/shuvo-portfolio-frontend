'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { SectionBadge } from '@/components/ui/SectionBadge';
import type { Publication, Profile } from '@/types/portfolio';
import { Check, Copy, ExternalLink, FlaskConical, BookOpen, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface ResearchSectionProps {
  publications?: Publication[];
  profile?: Profile;
  isLoading: boolean;
}

export function ResearchSection({ publications = [], profile, isLoading }: ResearchSectionProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const pubConfig = profile?.publicationsSection;
  const sectionBadge = pubConfig?.badge || 'Academic Scholarship & Papers';
  const sectionTitle = pubConfig?.title || 'Research & Publications';
  const sectionDesc =
    pubConfig?.description ||
    'Peer-reviewed empirical studies and ongoing manuscripts addressing vulnerable communities, socio-economic dynamics, and char region livelihood deprivations.';

  const copyCitation = (pub: Publication) => {
    const citation = `${pub.authors.join(', ')} (${pub.year}). ${pub.title}. ${pub.source}${pub.volume ? `, ${pub.volume}` : ''}${pub.pages ? `, pp. ${pub.pages}` : ''}.${pub.link ? ` ${pub.link}` : ''}`;
    navigator.clipboard.writeText(citation);
    setCopiedId(pub._id);
    toast.success('APA Citation copied to clipboard');
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <section id="research" className="section bg-grid-pattern" aria-label="Research & Publications">
      <div className="container">

        {/* Header */}
        <div className="section-header">
          <SectionBadge icon={<FlaskConical size={13} />}>
            {sectionBadge}
          </SectionBadge>
          <h2 className="section-title">{sectionTitle}</h2>
          <p className="section-description">
            {sectionDesc}
          </p>
        </div>

        {/* Publications List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {isLoading
            ? Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="bezel-card">
                  <div className="bezel-core" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Top Status & Meta Pill Row Skeleton */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.65rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div className="skeleton-pill" style={{ height: '24px', width: '140px' }} />
                        <div className="skeleton-pill" style={{ height: '24px', width: '60px' }} />
                      </div>
                    </div>

                    {/* Paper Title Skeleton */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                      <div className="skeleton" style={{ height: '22px', width: '85%', borderRadius: '6px' }} />
                      <div className="skeleton" style={{ height: '22px', width: '55%', borderRadius: '6px' }} />
                    </div>

                    {/* Authors & Source Meta Skeleton */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <div className="skeleton" style={{ height: '14px', width: '220px', borderRadius: '4px' }} />
                      <div className="skeleton" style={{ height: '14px', width: '310px', borderRadius: '4px' }} />
                    </div>

                    {/* Description Summary */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <div className="skeleton" style={{ height: '13px', width: '96%', borderRadius: '4px' }} />
                      <div className="skeleton" style={{ height: '13px', width: '70%', borderRadius: '4px' }} />
                    </div>

                    {/* Bottom Action Row */}
                    <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
                      <div className="skeleton" style={{ height: '34px', width: '125px', borderRadius: '8px' }} />
                      <div className="skeleton" style={{ height: '34px', width: '110px', borderRadius: '8px' }} />
                    </div>
                  </div>
                </div>
              ))
            : publications.map((pub) => {
                const isPublished = pub.status === 'published';
                const isCopied = copiedId === pub._id;

                return (
                  <article key={pub._id} className="bezel-card">
                    <div className="bezel-core" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                      {/* Top Status & Meta Pill Row */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.65rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                          <span className={`badge ${isPublished ? 'badge-primary' : ''}`} style={{ fontSize: '0.725rem' }}>
                            {isPublished ? 'Published & Indexed' : pub.status === 'underReview' ? 'Manuscript Under Review' : 'Research Assistant'}
                          </span>

                          <span
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: 'var(--fg-muted)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              padding: '0.2rem 0.55rem',
                              borderRadius: 'var(--radius-pill)',
                              backgroundColor: 'var(--bg-elevated)',
                              border: '1px solid var(--border)',
                            }}
                          >
                            <Calendar size={11} strokeWidth={1.8} style={{ color: 'var(--accent)' }} />
                            <span>{pub.year}</span>
                          </span>
                        </div>
                      </div>

                      {/* Paper Title */}
                      <h3
                        style={{
                          fontSize: 'clamp(1.05rem, 2.5vw, 1.25rem)',
                          lineHeight: 1.4,
                          fontWeight: 700,
                          color: 'var(--fg)',
                          margin: 0,
                          letterSpacing: '-0.015em',
                        }}
                      >
                        {pub.title}
                      </h3>

                      {/* Authors & Journal Source */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        <p style={{ fontSize: '0.85rem', color: 'var(--fg-muted)', margin: 0 }}>
                          <span style={{ fontWeight: 600, color: 'var(--fg)' }}>Authors: </span>
                          {pub.authors.join(', ')}
                        </p>

                        <p
                          style={{
                            fontSize: '0.85rem',
                            color: 'var(--accent)',
                            fontWeight: 600,
                            margin: 0,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            flexWrap: 'wrap',
                          }}
                        >
                          <BookOpen size={13} strokeWidth={1.75} style={{ flexShrink: 0 }} />
                          <span>
                            {pub.source}
                            {pub.volume && `, ${pub.volume}`}
                            {pub.pages && `, pp. ${pub.pages}`}
                          </span>
                        </p>
                      </div>

                      {pub.description && (
                        <p
                          style={{
                            fontSize: '0.875rem',
                            color: 'var(--fg-muted)',
                            lineHeight: 1.65,
                            margin: 0,
                            paddingTop: '0.75rem',
                            borderTop: '1px solid var(--border)',
                          }}
                        >
                          {pub.description}
                        </p>
                      )}

                      {/* Dedicated Card Footer Action Bar */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                          flexWrap: 'wrap',
                          gap: '0.65rem',
                          paddingTop: '0.85rem',
                          borderTop: '1px solid var(--border)',
                        }}
                      >
                        <button
                          onClick={() => copyCitation(pub)}
                          className="btn btn-secondary"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                            padding: '0.45rem 0.95rem',
                            fontSize: '0.8rem',
                            borderRadius: 'var(--radius-pill)',
                          }}
                          title="Copy APA Citation"
                          aria-label="Copy APA Citation"
                        >
                          {isCopied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                          <span>{isCopied ? 'Citation Copied' : 'Cite APA'}</span>
                        </button>

                        {pub.link && (
                          <a
                            href={pub.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.45rem',
                              padding: '0.45rem 1rem',
                              fontSize: '0.8rem',
                              borderRadius: 'var(--radius-pill)',
                            }}
                          >
                            <span>Read Paper</span>
                            <ExternalLink size={13} strokeWidth={2} />
                          </a>
                        )}
                      </div>

                    </div>
                  </article>
                );
              })}
        </div>

      </div>
    </section>
  );
}
