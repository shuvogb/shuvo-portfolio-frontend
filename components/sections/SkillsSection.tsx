'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Users, Layers } from 'lucide-react';
import type { Skill } from '@/types/portfolio';

interface SkillsSectionProps {
  skills?: Skill[];
  isLoading: boolean;
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
            <span className="section-eyebrow">
              <Layers size={13} /> Competencies
            </span>
            <h2 className="section-title">Skills & Methodologies</h2>
            <p className="section-description">
              Quantitative software tools, social research methodologies, and organizational leadership capabilities.
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

        {/* Skills Cards */}
        {isLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: '76px' }} />
            ))}
          </div>
        ) : (
          <motion.div
            layout
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}
          >
            <AnimatePresence mode="popLayout">
              {filteredSkills.map((skill) => {
                const isTech = skill.category === 'technical';
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
                          width: '36px',
                          height: '36px',
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
                        {isTech ? <Terminal size={16} /> : <Users size={16} />}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--fg)', marginBottom: '0.15rem' }}>
                          {skill.name}
                        </p>
                        <span className="mono" style={{ fontSize: '0.725rem', color: 'var(--fg-muted)', textTransform: 'capitalize' }}>
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
