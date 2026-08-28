'use client';

import { motion } from 'motion/react';
import { Briefcase, Calendar, CheckCircle2, Building } from 'lucide-react';
import type { Experience } from '@/types/portfolio';

interface ExperienceSectionProps {
  experience?: Experience[];
  isLoading: boolean;
}

export function ExperienceSection({ experience = [], isLoading }: ExperienceSectionProps) {
  return (
    <section id="experience" className="section grid-background" aria-label="Professional Experience">
      <div className="container">
        
        {/* Header */}
        <div className="section-header">
          <span className="section-eyebrow">
            <Briefcase size={13} /> Leadership & Engagement
          </span>
          <h2 className="section-title">Work & Leadership Experience</h2>
          <p className="section-description">
            Hands-on track record in social research, event operations, student organization administration, and youth empowerment.
          </p>
        </div>

        {/* Glowing Timeline */}
        <div className="timeline">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="timeline-item">
                  <div className="skeleton" style={{ height: '140px' }} />
                </div>
              ))
            : experience.map((exp, idx) => (
                <motion.div
                  key={exp._id}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="timeline-item"
                >
                  <div className="card card-interactive">
                    
                    {/* Role Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.2rem', color: 'var(--foreground)', marginBottom: '0.2rem' }}>
                          {exp.title}
                        </h3>
                        <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 600, fontSize: '0.925rem' }}>
                          <Building size={15} />
                          {exp.organization}
                        </p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {exp.isCurrent && (
                          <span className="badge badge-primary">
                            Current Role
                          </span>
                        )}
                        <span className="mono" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>
                          <Calendar size={13} />
                          {exp.startDate}{exp.isCurrent ? ' – Present' : exp.endDate ? ` – ${exp.endDate}` : ''}
                        </span>
                      </div>
                    </div>

                    {/* Bullets / Descriptions */}
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul role="list" style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                        {exp.bullets.map((bullet, i) => (
                          <li key={i} style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start' }}>
                            <CheckCircle2 size={15} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '3px' }} />
                            <span style={{ fontSize: '0.9rem', lineHeight: 1.65, color: 'var(--muted-foreground)' }}>
                              {bullet}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}

                  </div>
                </motion.div>
              ))}
        </div>

      </div>
    </section>
  );
}
