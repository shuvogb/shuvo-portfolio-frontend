'use client';

import { motion } from 'motion/react';
import { GraduationCap, Calendar, Award } from 'lucide-react';
import type { Education } from '@/types/portfolio';

interface EducationSectionProps {
  education?: Education[];
  isLoading: boolean;
}

export function EducationSection({ education, isLoading }: EducationSectionProps) {
  return (
    <section id="education" className="section" aria-label="Education">
      <div className="container">
        
        <div className="section-header">
          <span className="section-eyebrow">Academic Foundation</span>
          <h2 className="section-title">Education</h2>
        </div>

        <div className="timeline">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="timeline-item">
                  <div className="skeleton" style={{ height: '90px' }} />
                </div>
              ))
            : education?.map((edu) => (
                <div key={edu._id} className="timeline-item">
                  <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.4rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <GraduationCap size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                        <h3 style={{ fontSize: '1rem', color: 'var(--foreground)' }}>
                          {edu.degree}
                        </h3>
                      </div>
                      {edu.isCurrent && (
                        <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>Enrolled</span>
                      )}
                    </div>

                    <p style={{ color: 'var(--foreground)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.4rem' }}>
                      {edu.institution}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                      <span className="mono" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>
                        <Calendar size={12} />
                        {edu.startDate}{edu.isCurrent ? ' – Present' : edu.endDate ? ` – ${edu.endDate}` : ''}
                      </span>
                      <span className="mono" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>
                        <Award size={12} />
                        {edu.result}
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
