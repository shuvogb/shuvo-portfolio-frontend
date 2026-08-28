'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, ExternalLink, Copy, Check, FlaskConical } from 'lucide-react';
import { toast } from 'sonner';
import type { Publication } from '@/types/portfolio';

interface ResearchSectionProps {
  publications?: Publication[];
  isLoading: boolean;
}

export function ResearchSection({ publications = [], isLoading }: ResearchSectionProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
          <span className="section-eyebrow">
            <FlaskConical size={12} /> Academic Scholarship
          </span>
          <h2 className="section-title">Research & Publications</h2>
          <p className="section-description">
            Peer-reviewed empirical studies and ongoing manuscripts addressing vulnerable communities, socio-economic dynamics, and char region livelihood deprivations.
          </p>
        </div>

        {/* Publications List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {isLoading
            ? Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: '160px' }} />
              ))
            : publications.map((pub) => {
                const isPublished = pub.status === 'published';
                const isCopied = copiedId === pub._id;

                return (
                  <article key={pub._id} className="bezel-card">
                    <div className="bezel-core">
                      
                      {/* Top Meta Bar */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.85rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <span className={`badge ${isPublished ? 'badge-primary' : ''}`}>
                            {isPublished ? 'Published & Indexed' : pub.status === 'underReview' ? 'Manuscript Under Review' : 'Research Assistant'}
                          </span>
                          <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--fg-muted)' }}>
                            {pub.year}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <button
                            onClick={() => copyCitation(pub)}
                            className="btn btn-secondary"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.775rem' }}
                            title="Copy APA Citation"
                            aria-label="Copy APA Citation"
                          >
                            {isCopied ? <Check size={13} style={{ color: 'var(--accent)' }} /> : <Copy size={13} />}
                            {isCopied ? 'Copied' : 'Cite APA'}
                          </button>

                          {pub.link && (
                            <a
                              href={pub.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-island-primary"
                              style={{ padding: '0.35rem 0.4rem 0.35rem 0.85rem', fontSize: '0.775rem' }}
                            >
                              <span>Read Paper</span>
                              <span className="btn-island-icon" style={{ width: '22px', height: '22px' }}>
                                <ExternalLink size={11} />
                              </span>
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Paper Title */}
                      <h3 style={{ fontSize: '1.2rem', lineHeight: 1.45, marginBottom: '0.5rem', color: 'var(--fg)' }}>
                        {pub.title}
                      </h3>

                      {/* Authors */}
                      <p style={{ fontSize: '0.875rem', color: 'var(--fg-muted)', marginBottom: '0.4rem' }}>
                        <span style={{ fontWeight: 600, color: 'var(--fg)' }}>Authors: </span>
                        {pub.authors.join(', ')}
                      </p>

                      {/* Source */}
                      <p style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600 }}>
                        {pub.source}
                        {pub.volume && `, ${pub.volume}`}
                        {pub.pages && `, pp. ${pub.pages}`}
                      </p>

                      {pub.description && (
                        <p style={{ fontSize: '0.875rem', color: 'var(--fg-muted)', marginTop: '0.85rem', lineHeight: 1.75, paddingTop: '0.85rem', borderTop: '1px solid var(--border)' }}>
                          {pub.description}
                        </p>
                      )}

                    </div>
                  </article>
                );
              })}
        </div>

      </div>
    </section>
  );
}
