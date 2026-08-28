'use client';

import { motion } from 'motion/react';
import { BookOpen, ExternalLink, FileText } from 'lucide-react';
import type { Publication } from '@/types/portfolio';

interface ResearchSectionProps {
  publications?: Publication[];
  isLoading: boolean;
}

export function ResearchSection({ publications, isLoading }: ResearchSectionProps) {
  return (
    <section id="research" className="section" aria-label="Research & Publications">
      <div className="container">
        
        <div className="section-header">
          <span className="section-eyebrow">Academic Output</span>
          <h2 className="section-title">Research & Publications</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {isLoading
            ? Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: '130px' }} />
              ))
            : publications?.map((pub) => {
                const isPublished = pub.status === 'published';
                return (
                  <article key={pub._id} className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className={`badge ${isPublished ? 'badge-primary' : ''}`}>
                          {isPublished ? 'Published' : pub.status === 'underReview' ? 'Under Review' : 'Research Assistant'}
                        </span>
                        <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>
                          {pub.year}
                        </span>
                      </div>

                      {pub.link && (
                        <a
                          href={pub.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-secondary"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                        >
                          View Paper <ExternalLink size={12} />
                        </a>
                      )}
                    </div>

                    <h3 style={{ fontSize: '1.05rem', lineHeight: 1.5, marginBottom: '0.4rem', color: 'var(--foreground)' }}>
                      {pub.title}
                    </h3>

                    <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', marginBottom: '0.3rem' }}>
                      {pub.authors.join(', ')}
                    </p>

                    <p style={{ fontSize: '0.825rem', color: 'var(--primary)', fontWeight: 500 }}>
                      {pub.source}
                      {pub.volume && `, ${pub.volume}`}
                      {pub.pages && `, pp. ${pub.pages}`}
                    </p>

                    {pub.description && (
                      <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', marginTop: '0.75rem', lineHeight: 1.7 }}>
                        {pub.description}
                      </p>
                    )}
                  </article>
                );
              })}
        </div>

      </div>
    </section>
  );
}
