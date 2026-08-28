'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Layers,
  BarChart3,
  FileSpreadsheet,
  FileText,
  Presentation,
  Camera,
  Palette,
  Award,
  MessageSquare,
  Brain,
  CalendarCheck,
  Users,
  Lightbulb,
  Compass,
  Database,
  ClipboardList,
  Terminal,
} from 'lucide-react';
import { SectionBadge } from '@/components/ui/SectionBadge';
import type { Skill } from '@/types/portfolio';

interface SkillsSectionProps {
  skills?: Skill[];
  isLoading: boolean;
}

function getSkillIcon(name: string, category: string) {
  const lower = name.toLowerCase();

  // Technical Skills (Outline icons)
  if (lower.includes('spss') || lower.includes('quantitative')) {
    return <BarChart3 size={19} strokeWidth={1.75} style={{ color: 'var(--accent)' }} />;
  }
  if (lower.includes('excel')) {
    return <FileSpreadsheet size={19} strokeWidth={1.75} style={{ color: 'var(--accent)' }} />;
  }
  if (lower.includes('word')) {
    return <FileText size={19} strokeWidth={1.75} style={{ color: 'var(--accent)' }} />;
  }
  if (lower.includes('powerpoint')) {
    return <Presentation size={19} strokeWidth={1.75} style={{ color: 'var(--accent)' }} />;
  }
  if (lower.includes('canva') || lower.includes('visual design')) {
    return <Palette size={19} strokeWidth={1.75} style={{ color: 'var(--accent)' }} />;
  }
  if (lower.includes('research method') || lower.includes('social research')) {
    return <Database size={19} strokeWidth={1.75} style={{ color: 'var(--accent)' }} />;
  }
  if (lower.includes('data collection') || lower.includes('survey')) {
    return <ClipboardList size={19} strokeWidth={1.75} style={{ color: 'var(--accent)' }} />;
  }
  if (lower.includes('photo') || lower.includes('media')) {
    return <Camera size={19} strokeWidth={1.75} style={{ color: 'var(--fg)' }} />;
  }

  // Professional Skills (Outline icons)
  if (lower.includes('leader')) {
    return <Award size={19} strokeWidth={1.75} style={{ color: 'var(--accent)' }} />;
  }
  if (lower.includes('communicat')) {
    return <MessageSquare size={19} strokeWidth={1.75} style={{ color: 'var(--fg)' }} />;
  }
  if (lower.includes('analytic') || lower.includes('think') || lower.includes('critical')) {
    return <Brain size={19} strokeWidth={1.75} style={{ color: 'var(--accent)' }} />;
  }
  if (lower.includes('event') || lower.includes('planning')) {
    return <CalendarCheck size={19} strokeWidth={1.75} style={{ color: 'var(--fg)' }} />;
  }
  if (lower.includes('team') || lower.includes('collab') || lower.includes('mentor')) {
    return <Users size={19} strokeWidth={1.75} style={{ color: 'var(--accent)' }} />;
  }
  if (lower.includes('creativ') || lower.includes('problem')) {
    return <Lightbulb size={19} strokeWidth={1.75} style={{ color: 'var(--accent)' }} />;
  }
  if (lower.includes('climate') || lower.includes('advocacy') || lower.includes('youth')) {
    return <Compass size={19} strokeWidth={1.75} style={{ color: 'var(--accent)' }} />;
  }

  return category === 'technical' ? (
    <Terminal size={19} strokeWidth={1.75} style={{ color: 'var(--accent)' }} />
  ) : (
    <Compass size={19} strokeWidth={1.75} style={{ color: 'var(--accent)' }} />
  );
}

export function SkillsSection({ skills = [], isLoading }: SkillsSectionProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'technical' | 'professional'>('all');

  const filteredSkills = useMemo(() => {
    const list = skills.filter((skill) => {
      return activeTab === 'all' || skill.category === activeTab;
    });

    // Group Technical skills first, then Professional skills
    return [...list].sort((a, b) => {
      if (a.category !== b.category) {
        return a.category === 'technical' ? -1 : 1;
      }
      return (a.order || 0) - (b.order || 0);
    });
  }, [skills, activeTab]);

  const technicalCount = skills.filter((s) => s.category === 'technical').length;
  const professionalCount = skills.filter((s) => s.category === 'professional').length;

  return (
    <section id="skills" className="section" aria-label="Skills & Competencies">
      <div className="container">
        
        {/* Header */}
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <SectionBadge icon={<Layers size={13} strokeWidth={1.75} />}>
              Competencies & Methodologies
            </SectionBadge>
            <h2 className="section-title">Skills & Capabilities</h2>
            <p className="section-description">
              Quantitative analysis software, survey methodologies, media tools, and organizational governance capabilities.
            </p>
          </div>

          {/* Clean Tab Switcher */}
          <div
            style={{
              display: 'flex',
              padding: '4px',
              backgroundColor: 'var(--bg-elevated)',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid var(--border)',
              gap: '3px',
            }}
            role="tablist"
          >
            {[
              { id: 'all', label: `All (${skills.length})` },
              { id: 'technical', label: `Technical (${technicalCount})` },
              { id: 'professional', label: `Professional (${professionalCount})` },
            ].map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveTab(tab.id as 'all' | 'technical' | 'professional')}
                  style={{
                    padding: '0.45rem 1rem',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    borderRadius: 'var(--radius-pill)',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? 'var(--bg-surface)' : 'transparent',
                    color: isSelected ? 'var(--fg)' : 'var(--fg-muted)',
                    boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                    transition: 'background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease',
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3-in-a-row Skills Grid with Bottom-to-Top Translation & Opacity Animation */}
        {isLoading ? (
          <div className="skills-grid-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: '80px' }} />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="skills-grid-3"
            >
              {filteredSkills.map((skill) => {
                const isTech = skill.category === 'technical';
                const icon = getSkillIcon(skill.name, skill.category);

                return (
                  <div
                    key={skill._id}
                    className="bezel-card bezel-card-interactive"
                  >
                    <div
                      className="bezel-core"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.95rem',
                        padding: '1.05rem 1.2rem',
                      }}
                    >
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '11px',
                          backgroundColor: isTech ? 'var(--accent-subtle)' : 'var(--bg-elevated)',
                          border: isTech ? '1px solid var(--accent-border)' : '1px solid var(--border)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          boxShadow: 'var(--shadow-sm)',
                        }}
                      >
                        {icon}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            fontSize: '0.925rem',
                            fontWeight: 600,
                            letterSpacing: '-0.015em',
                            color: 'var(--fg)',
                            marginBottom: '0.25rem',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            lineHeight: 1.3,
                          }}
                        >
                          {skill.name}
                        </p>
                        <span
                          style={{
                            fontSize: '0.725rem',
                            fontWeight: 600,
                            letterSpacing: '0.01em',
                            color: isTech ? 'var(--accent)' : 'var(--fg-muted)',
                            textTransform: 'capitalize',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                          }}
                        >
                          <span
                            style={{
                              width: '5px',
                              height: '5px',
                              borderRadius: '50%',
                              backgroundColor: isTech ? 'var(--accent)' : 'var(--border-strong)',
                            }}
                          />
                          {skill.category}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        )}

      </div>

      <style>{`
        .skills-grid-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }
        @media (max-width: 992px) {
          .skills-grid-3 {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .skills-grid-3 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
