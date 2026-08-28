'use client';

import { motion } from 'motion/react';
import { Calendar, Briefcase } from 'lucide-react';
import type { Experience } from '@/types/portfolio';

interface ExperienceSectionProps {
  experience?: Experience[];
  isLoading: boolean;
}

export function ExperienceSection({ experience, isLoading }: ExperienceSectionProps) {
  return (
    <section id="experience" className="section section-alt" aria-label="Work Experience">
      <div className="container">
        
        <div className="section-header">
          <span className="section-eyebrow">Career Path</span>
          <h2 className="section-title">Work Experience</h2>
        </div>

        <div className="timeline">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="timeline-item">
                  <div className="skeleton" style={{ height: '110px' }} />
                </div>
              ))
            : experience?.map((exp) => (
                <div key={exp._id} className="timeline-item">
                  <div className="card">
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.05rem', color: 'var(--foreground)', marginBottom: '0.2rem' }}>
                          {exp.title}
                        </h3>
                        <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>
                          {exp.organization}
                        </p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="mono" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                          <Calendar size={12} />
                          {exp.startDate}{exp.isCurrent ? ' – Present' : exp.endDate ? ` – ${exp.endDate}` : ''}
                        </span>
                        {exp.isCurrent && (
                          <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                            Current
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bullets */}
                    {exp.bullets.length > 0 && (
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.5rem' }}>
                        {exp.bullets.map((bullet, i) => (
                          <li
                            key={i}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '0.5rem',
                              fontSize: '0.875rem',
                              color: 'var(--muted-foreground)',
                              lineHeight: 1.6,
                            }}
                          >
                            <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--primary)', marginTop: '8px', flexShrink: 0 }} />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                  </div>
                </div>
              ))}
        </div>

      </div>
    </section>
  );
}
