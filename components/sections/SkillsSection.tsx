'use client';

import { motion } from 'motion/react';
import { Terminal, Users } from 'lucide-react';
import type { Skill } from '@/types/portfolio';

interface SkillsSectionProps {
  skills?: Skill[];
  isLoading: boolean;
}

export function SkillsSection({ skills, isLoading }: SkillsSectionProps) {
  const technical = skills?.filter((s) => s.category === 'technical') || [];
  const professional = skills?.filter((s) => s.category === 'professional') || [];

  return (
    <section id="skills" className="section" aria-label="Skills">
      <div className="container">
        
        <div className="section-header">
          <span className="section-eyebrow">Capabilities</span>
          <h2 className="section-title">Skills & Competencies</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          
          {/* Technical Skills */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{
                width: '36px', height: '36px',
                borderRadius: 'var(--radius)',
                backgroundColor: 'var(--primary-subtle)',
                color: 'var(--primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Terminal size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem' }}>Technical & Research Skills</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>Methodologies, quantitative software & tools</p>
              </div>
            </div>

            {isLoading ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="skeleton" style={{ height: '32px', width: `${90 + i * 20}px` }} />
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {technical.map((skill) => (
                  <span
                    key={skill._id}
                    className="badge badge-primary"
                    style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Professional Skills */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{
                width: '36px', height: '36px',
                borderRadius: 'var(--radius)',
                backgroundColor: 'var(--secondary)',
                color: 'var(--foreground)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Users size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem' }}>Professional Competencies</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>Leadership, organizing & collaboration</p>
              </div>
            </div>

            {isLoading ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <span key={i} className="skeleton" style={{ height: '32px', width: `${80 + i * 15}px` }} />
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {professional.map((skill) => (
                  <span
                    key={skill._id}
                    className="badge"
                    style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
