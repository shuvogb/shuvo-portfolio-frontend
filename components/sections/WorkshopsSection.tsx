'use client';

import { motion } from 'motion/react';
import { Award } from 'lucide-react';
import type { Workshop } from '@/types/portfolio';

interface WorkshopsSectionProps {
  workshops?: Workshop[];
  isLoading: boolean;
}

export function WorkshopsSection({ workshops, isLoading }: WorkshopsSectionProps) {
  return (
    <section id="workshops" className="section section-alt" aria-label="Workshops and Training">
      <div className="container">
        
        <div className="section-header">
          <span className="section-eyebrow">Professional Development</span>
          <h2 className="section-title">Workshops & Training</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: '64px' }} />
              ))
            : workshops?.map((ws) => (
                <div
                  key={ws._id}
                  className="card"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', gap: '1rem' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{
                      width: '32px', height: '32px',
                      borderRadius: 'var(--radius)',
                      backgroundColor: 'var(--primary-subtle)',
                      color: 'var(--primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Award size={16} />
                    </div>
                    <div>
                      <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '0.15rem' }}>
                        {ws.title}
                      </p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>
                        {ws.organizer}
                      </p>
                    </div>
                  </div>

                  <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, flexShrink: 0 }}>
                    {ws.year}
                  </span>
                </div>
              ))}
        </div>

      </div>
    </section>
  );
}
