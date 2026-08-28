'use client';

import { motion } from 'motion/react';
import { Trophy, CheckCircle } from 'lucide-react';
import type { Achievement } from '@/types/portfolio';

interface AchievementsSectionProps {
  achievements?: Achievement[];
  isLoading: boolean;
}

export function AchievementsSection({ achievements = [], isLoading }: AchievementsSectionProps) {
  return (
    <section id="achievements" className="section" aria-label="Key Achievements & Milestones">
      <div className="container">
        
        {/* Header */}
        <div className="section-header">
          <span className="section-eyebrow">
            <Trophy size={12} /> Impact & Milestones
          </span>
          <h2 className="section-title">Key Achievements</h2>
          <p className="section-description">
            Quantifiable leadership results, event management track record, and student organization stewardship.
          </p>
        </div>

        {/* Bento Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: '90px' }} />
              ))
            : achievements.map((ach, idx) => (
                <div key={ach._id} className="bezel-card bezel-card-interactive">
                  <div
                    className="bezel-core"
                    style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start', padding: '1.25rem' }}
                  >
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--accent-subtle)',
                        color: 'var(--accent)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px',
                      }}
                    >
                      <CheckCircle size={15} />
                    </div>
                    <p style={{ fontSize: '0.9rem', lineHeight: 1.65, color: 'var(--fg)', fontWeight: 500 }}>
                      {ach.description}
                    </p>
                  </div>
                </div>
              ))}
        </div>

      </div>
    </section>
  );
}
