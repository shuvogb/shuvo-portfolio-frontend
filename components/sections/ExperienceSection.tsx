'use client';

import { motion } from 'motion/react';
import { Briefcase, Calendar, CheckCircle2, Building, MapPin, ArrowUpRight } from 'lucide-react';
import { SectionBadge } from '@/components/ui/SectionBadge';
import type { Experience } from '@/types/portfolio';

interface ExperienceSectionProps {
  experience?: Experience[];
  isLoading: boolean;
}

export function ExperienceSection({ experience = [], isLoading }: ExperienceSectionProps) {
  return (
    <section id="experience" className="section bg-grid-pattern" aria-label="Professional Experience">
      <div className="container">
        
        {/* Header */}
        <div className="section-header">
          <SectionBadge icon={<Briefcase size={13} />}>
            Leadership & Career
          </SectionBadge>
          <h2 className="section-title">Work & Leadership Experience</h2>
          <p className="section-description">
            Hands-on track record in social research, event operations, student organization administration, and youth empowerment.
          </p>
        </div>

        {/* Timeline */}
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
                  <div className="bezel-card bezel-card-interactive">
                    <div className="bezel-core">
                      
                      {/* Role Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                        <div>
                          <h3 style={{ fontSize: '1.15rem', color: 'var(--fg)', marginBottom: '0.25rem', fontWeight: 700 }}>
                            {exp.title}
                          </h3>
                          <p style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--accent)', fontWeight: 600, fontSize: '0.9rem' }}>
                            <Building size={15} />
                            {exp.organization}
                          </p>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {exp.isCurrent && (
                            <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                              <CheckCircle2 size={11} /> Current Role
                            </span>
                          )}
                          <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--fg-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Calendar size={13} />
                            {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                          </span>
                        </div>
                      </div>

                      {/* Bullet Highlights */}
                      {exp.bullets && exp.bullets.length > 0 && (
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                          {exp.bullets.map((bullet, bIdx) => (
                            <li
                              key={bIdx}
                              style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '0.65rem',
                                fontSize: '0.9rem',
                                color: 'var(--fg-muted)',
                                lineHeight: 1.6,
                              }}
                            >
                              <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'var(--accent)', marginTop: '8px', flexShrink: 0 }} />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                    </div>
                  </div>
                </motion.div>
              ))}
        </div>

      </div>
    </section>
  );
}
