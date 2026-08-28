'use client';

import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import type { Achievement } from '@/types/portfolio';

interface AchievementsSectionProps {
  achievements?: Achievement[];
  isLoading: boolean;
}

export function AchievementsSection({ achievements, isLoading }: AchievementsSectionProps) {
  return (
    <section id="achievements" className="section section-alt" aria-label="Key Achievements">
      <div className="container">
        
        <div className="section-header">
          <span className="section-eyebrow">Milestones</span>
          <h2 className="section-title">Key Achievements</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: '80px' }} />
              ))
            : achievements?.map((ach) => (
                <div
                  key={ach._id}
                  className="card"
                  style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}
                >
                  <div style={{
                    width: '24px', height: '24px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-subtle)',
                    color: 'var(--primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}>
                    <CheckCircle2 size={14} />
                  </div>
                  <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--foreground)' }}>
                    {ach.description}
                  </p>
                </div>
              ))}
        </div>

      </div>
    </section>
  );
}
