'use client';

import { motion } from 'motion/react';
import { Award, BookCheck } from 'lucide-react';
import type { Workshop } from '@/types/portfolio';

interface WorkshopsSectionProps {
  workshops?: Workshop[];
  isLoading: boolean;
}

export function WorkshopsSection({ workshops = [], isLoading }: WorkshopsSectionProps) {
  return (
    <section id="workshops" className="section" aria-label="Workshops and Professional Training">
      <div className="container">
        
        {/* Header */}
        <div className="section-header">
          <span className="section-eyebrow">
            <BookCheck size={12} /> Professional Development
          </span>
          <h2 className="section-title">Workshops & Certifications</h2>
          <p className="section-description">
            Specialized training programs in quantitative social methodology, field research ethics, and institutional leadership.
          </p>
        </div>

        {/* List Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: '80px' }} />
              ))
            : workshops.map((ws) => (
                <div key={ws._id} className="bezel-card bezel-card-interactive">
                  <div
                    className="bezel-core"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '0.75rem',
                      padding: '1.25rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          backgroundColor: 'var(--accent-subtle)',
                          color: 'var(--accent)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginTop: '2px',
                        }}
                      >
                        <Award size={16} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, lineHeight: 1.4, color: 'var(--fg)', marginBottom: '0.2rem' }}>
                          {ws.title}
                        </h3>
                        <p style={{ fontSize: '0.825rem', color: 'var(--fg-muted)' }}>
                          {ws.organizer}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
                      <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 700 }}>
                        {ws.year}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
        </div>

      </div>
    </section>
  );
}
