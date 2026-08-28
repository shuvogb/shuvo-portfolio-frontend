'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Users, Layers, BarChart3, FileSpreadsheet, Camera, Palette, Award, MessageSquare, Brain, CalendarCheck, Lightbulb, Compass, FileText, Presentation, Database, ClipboardList } from 'lucide-react';
import { SectionBadge } from '@/components/ui/SectionBadge';
import type { Skill } from '@/types/portfolio';

interface SkillsSectionProps {
  skills?: Skill[];
  isLoading: boolean;
}

function getSkillIcon(name: string, category: string) {
  const lower = name.toLowerCase();
  if (lower.includes('excel')) return <FileSpreadsheet size={18} style={{ color: '#107c41' }} />;
  if (lower.includes('word')) return <FileText size={18} style={{ color: '#2b579a' }} />;
  if (lower.includes('powerpoint')) return <Presentation size={18} style={{ color: '#d24726' }} />;
  if (lower.includes('canva') || lower.includes('design')) return <Palette size={18} style={{ color: '#00c4cc' }} />;
  if (lower.includes('spss') || lower.includes('quantitative')) return <BarChart3 size={18} style={{ color: 'var(--accent)' }} />;
  if (lower.includes('data collection') || lower.includes('survey')) return <ClipboardList size={18} style={{ color: 'var(--accent)' }} />;
  if (lower.includes('research method') || lower.includes('social research')) return <Database size={18} style={{ color: 'var(--accent)' }} />;
  if (lower.includes('photo') || lower.includes('media')) return <Camera size={18} />;
  if (lower.includes('leader')) return <Award size={18} style={{ color: 'var(--accent)' }} />;
  if (lower.includes('communicat')) return <MessageSquare size={18} />;
  if (lower.includes('analytic') || lower.includes('think') || lower.includes('critical')) return <Brain size={18} />;
  if (lower.includes('event') || lower.includes('planning')) return <CalendarCheck size={18} />;
  if (lower.includes('creativ') || lower.includes('problem')) return <Lightbulb size={18} />;
  if (lower.includes('team') || lower.includes('collab') || lower.includes('mentor')) return <Users size={18} />;
  if (lower.includes('climate') || lower.includes('advocacy')) return <Compass size={18} style={{ color: 'var(--accent)' }} />;
  return category === 'technical' ? <Terminal size={18} /> : <Compass size={18} />;
}

export function SkillsSection({ skills = [], isLoading }: SkillsSectionProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'technical' | 'professional'>('all');

  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      return activeTab === 'all' || skill.category === activeTab;
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
            <SectionBadge icon={<Layers size={13} />}>
              Competencies & Methodologies
            </SectionBadge>
            <h2 className="section-title">Skills & Capabilities</h2>
            <p className="section-description">
              Quantitative analysis software, survey methodologies, media tools, and organizational governance capabilities.
            </p>
          </div>

          {/* Category Tabs */}
          <div
            style={{
              display: 'flex',
              padding: '4px',
              backgroundColor: 'var(--bg-elevated)',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid var(--border)',
              gap: '2px',
            }}
            role="tablist"
          >
            {[
              { id: 'all', label: `All (${skills.length})` },
              { id: 'technical', label: `Technical (${technicalCount})` },
              { id: 'professional', label: `Professional (${professionalCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id as 'all' | 'technical' | 'professional')}
                style={{
                  padding: '0.45rem 0.95rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-pill)',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: activeTab === tab.id ? 'var(--bg-surface)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--fg)' : 'var(--fg-muted)',
                  boxShadow: activeTab === tab.id ? 'var(--shadow-sm)' : 'none',
                  transition: 'all 0.2s var(--ease-spring)',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Cards Grid */}
        {isLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: '76px' }} />
            ))}
          </div>
        ) : (
          <motion.div
            layout
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}
          >
            <AnimatePresence mode="popLayout">
              {filteredSkills.map((skill) => {
                const isTech = skill.category === 'technical';
                const icon = getSkillIcon(skill.name, skill.category);

                return (
                  <motion.div
                    key={skill._id}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                    className="bezel-card bezel-card-interactive"
                  >
                    <div
                      className="bezel-core"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.85rem',
                        padding: '1rem 1.15rem',
                      }}
                    >
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '10px',
                          backgroundColor: isTech ? 'var(--accent-subtle)' : 'var(--bg-elevated)',
                          color: isTech ? 'var(--accent)' : 'var(--fg)',
                          border: isTech ? '1px solid var(--accent-border)' : '1px solid var(--border)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {icon}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--fg)', marginBottom: '0.15rem' }}>
                          {skill.name}
                        </p>
                        <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--fg-muted)', textTransform: 'capitalize' }}>
                          {skill.category}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

      </div>
    </section>
  );
}
