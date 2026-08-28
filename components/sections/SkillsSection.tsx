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
  Code2,
  Globe,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  Target,
  PieChart,
  Cpu,
  Zap,
  BookOpen,
  FolderKanban,
  CheckCircle2,
} from 'lucide-react';
import { SectionBadge } from '@/components/ui/SectionBadge';
import type { Skill, Profile } from '@/types/portfolio';

interface SkillsSectionProps {
  skills?: Skill[];
  profile?: Profile;
  isLoading: boolean;
}

export const SKILL_ICON_MAP: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>> = {
  barchart: BarChart3,
  spreadsheet: FileSpreadsheet,
  filetext: FileText,
  presentation: Presentation,
  camera: Camera,
  palette: Palette,
  award: Award,
  message: MessageSquare,
  brain: Brain,
  calendar: CalendarCheck,
  users: Users,
  lightbulb: Lightbulb,
  compass: Compass,
  database: Database,
  clipboard: ClipboardList,
  terminal: Terminal,
  code: Code2,
  globe: Globe,
  shield: Shield,
  sparkles: Sparkles,
  star: Star,
  trending: TrendingUp,
  target: Target,
  piechart: PieChart,
  cpu: Cpu,
  zap: Zap,
  book: BookOpen,
  kanban: FolderKanban,
  check: CheckCircle2,
  layers: Layers,
};

export function renderSkillIcon(iconKey?: string, name = '', category = 'technical') {
  if (iconKey && SKILL_ICON_MAP[iconKey.toLowerCase()]) {
    const IconComponent = SKILL_ICON_MAP[iconKey.toLowerCase()];
    return <IconComponent size={18} strokeWidth={1.75} style={{ color: category === 'technical' ? 'var(--accent)' : 'var(--fg)' }} />;
  }

  const lower = name.toLowerCase();

  // Smart fallback matching
  if (lower.includes('spss') || lower.includes('quantitative') || lower.includes('stata')) {
    return <BarChart3 size={18} strokeWidth={1.75} style={{ color: 'var(--accent)' }} />;
  }
  if (lower.includes('excel') || lower.includes('sheet')) {
    return <FileSpreadsheet size={18} strokeWidth={1.75} style={{ color: 'var(--accent)' }} />;
  }
  if (lower.includes('word') || lower.includes('document')) {
    return <FileText size={18} strokeWidth={1.75} style={{ color: 'var(--accent)' }} />;
  }
  if (lower.includes('powerpoint') || lower.includes('presentation') || lower.includes('slide')) {
    return <Presentation size={18} strokeWidth={1.75} style={{ color: 'var(--accent)' }} />;
  }
  if (lower.includes('canva') || lower.includes('visual') || lower.includes('design')) {
    return <Palette size={18} strokeWidth={1.75} style={{ color: 'var(--accent)' }} />;
  }
  if (lower.includes('research method') || lower.includes('social research') || lower.includes('database')) {
    return <Database size={18} strokeWidth={1.75} style={{ color: 'var(--accent)' }} />;
  }
  if (lower.includes('data collection') || lower.includes('survey') || lower.includes('fieldwork')) {
    return <ClipboardList size={18} strokeWidth={1.75} style={{ color: 'var(--accent)' }} />;
  }
  if (lower.includes('photo') || lower.includes('media') || lower.includes('video')) {
    return <Camera size={18} strokeWidth={1.75} style={{ color: 'var(--fg)' }} />;
  }
  if (lower.includes('leader') || lower.includes('governance')) {
    return <Award size={18} strokeWidth={1.75} style={{ color: 'var(--accent)' }} />;
  }
  if (lower.includes('communicat') || lower.includes('interpersonal')) {
    return <MessageSquare size={18} strokeWidth={1.75} style={{ color: 'var(--fg)' }} />;
  }
  if (lower.includes('analytic') || lower.includes('think') || lower.includes('critical')) {
    return <Brain size={18} strokeWidth={1.75} style={{ color: 'var(--accent)' }} />;
  }
  if (lower.includes('event') || lower.includes('planning') || lower.includes('coordinat')) {
    return <CalendarCheck size={18} strokeWidth={1.75} style={{ color: 'var(--fg)' }} />;
  }
  if (lower.includes('team') || lower.includes('collab') || lower.includes('mentor')) {
    return <Users size={18} strokeWidth={1.75} style={{ color: 'var(--accent)' }} />;
  }
  if (lower.includes('creativ') || lower.includes('problem')) {
    return <Lightbulb size={18} strokeWidth={1.75} style={{ color: 'var(--accent)' }} />;
  }
  if (lower.includes('climate') || lower.includes('advocacy') || lower.includes('youth') || lower.includes('community')) {
    return <Compass size={18} strokeWidth={1.75} style={{ color: 'var(--accent)' }} />;
  }

  return category === 'technical' ? (
    <Terminal size={18} strokeWidth={1.75} style={{ color: 'var(--accent)' }} />
  ) : (
    <Compass size={18} strokeWidth={1.75} style={{ color: 'var(--accent)' }} />
  );
}

export function SkillsSection({ skills = [], profile, isLoading }: SkillsSectionProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'technical' | 'professional'>('all');

  const skillsConfig = profile?.skillsSection;
  const sectionBadge = skillsConfig?.badge || 'Competencies & Methodologies';
  const sectionTitle = skillsConfig?.title || 'Skills & Capabilities';
  const sectionDesc =
    skillsConfig?.description ||
    'Quantitative analysis software, survey methodologies, media tools, and organizational governance capabilities.';

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
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div>
            <SectionBadge icon={<Layers size={13} strokeWidth={1.75} />}>
              {sectionBadge}
            </SectionBadge>
            <h2 className="section-title">{sectionTitle}</h2>
            <p className="section-description" style={{ marginTop: '0.45rem' }}>
              {sectionDesc}
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
                    padding: '0.35rem 0.85rem',
                    fontSize: '0.8rem',
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

        {/* Compact Bezel Card Grid with Preserved Doppelrand Padding Architecture */}
        {isLoading ? (
          <div className="skills-grid">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: '70px', borderRadius: '16px' }} />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="skills-grid"
            >
              {filteredSkills.map((skill) => {
                const isTech = skill.category === 'technical';
                const icon = renderSkillIcon(skill.icon, skill.name, skill.category);

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
                        gap: '0.85rem',
                        padding: '0.8rem 1rem',
                      }}
                    >
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
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
                            fontSize: '0.875rem',
                            fontWeight: 650,
                            letterSpacing: '-0.015em',
                            color: 'var(--fg)',
                            marginBottom: '0.15rem',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            lineHeight: 1.25,
                          }}
                        >
                          {skill.name}
                        </p>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            letterSpacing: '0.01em',
                            color: isTech ? 'var(--accent)' : 'var(--fg-muted)',
                            textTransform: 'capitalize',
                            display: 'block',
                            lineHeight: 1,
                          }}
                        >
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
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.85rem;
        }

        @media (max-width: 900px) {
          .skills-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
          }
        }

        @media (max-width: 580px) {
          .skills-grid {
            grid-template-columns: 1fr;
            gap: 0.65rem;
          }
        }
      `}</style>
    </section>
  );
}
