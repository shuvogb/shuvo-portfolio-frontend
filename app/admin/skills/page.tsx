'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  Loader2,
  SlidersHorizontal,
  AlertTriangle,
  Terminal,
  Compass,
  Sparkles,
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { CustomSelect, CustomSelectOption } from '@/components/ui/custom-select';
import { SKILL_ICON_MAP, renderSkillIcon } from '@/components/sections/SkillsSection';
import type { Skill } from '@/types/portfolio';

// Category Options with Icons
const CATEGORY_OPTIONS: CustomSelectOption[] = [
  {
    value: 'technical',
    label: 'Technical',
    badge: 'Methods & Tools',
    icon: <Terminal size={16} />,
  },
  {
    value: 'professional',
    label: 'Professional',
    badge: 'Soft & Governance',
    icon: <Compass size={16} />,
  },
];

// Rich Icon Options with actual rendered Icons
const ICON_OPTIONS: CustomSelectOption[] = [
  { value: '', label: 'Auto (Smart Match from title)', icon: <Sparkles size={16} /> },
  { value: 'barchart', label: 'Bar Chart (SPSS / Statistics)', icon: renderSkillIcon('barchart') },
  { value: 'spreadsheet', label: 'Spreadsheet (Microsoft Excel)', icon: renderSkillIcon('spreadsheet') },
  { value: 'filetext', label: 'Document (Microsoft Word)', icon: renderSkillIcon('filetext') },
  { value: 'presentation', label: 'Presentation (PowerPoint)', icon: renderSkillIcon('presentation') },
  { value: 'palette', label: 'Palette (Canva & Visual Design)', icon: renderSkillIcon('palette') },
  { value: 'camera', label: 'Camera (Photography & Media)', icon: renderSkillIcon('camera') },
  { value: 'database', label: 'Database (Social Research Methods)', icon: renderSkillIcon('database') },
  { value: 'clipboard', label: 'Clipboard (Survey & Data Collection)', icon: renderSkillIcon('clipboard') },
  { value: 'award', label: 'Award (Strategic Leadership)', icon: renderSkillIcon('award') },
  { value: 'message', label: 'Message (Interpersonal Communication)', icon: renderSkillIcon('message') },
  { value: 'brain', label: 'Brain (Analytical & Critical Thinking)', icon: renderSkillIcon('brain') },
  { value: 'calendar', label: 'Calendar (Event Planning & Execution)', icon: renderSkillIcon('calendar') },
  { value: 'users', label: 'Users (Team Collaboration & Mentorship)', icon: renderSkillIcon('users') },
  { value: 'lightbulb', label: 'Lightbulb (Creative Problem Solving)', icon: renderSkillIcon('lightbulb') },
  { value: 'compass', label: 'Compass (Youth & Climate Advocacy)', icon: renderSkillIcon('compass') },
  { value: 'code', label: 'Code (Software & Development)', icon: renderSkillIcon('code') },
  { value: 'terminal', label: 'Terminal (Scripting & Command Line)', icon: renderSkillIcon('terminal') },
  { value: 'globe', label: 'Globe (International / Char Studies)', icon: renderSkillIcon('globe') },
  { value: 'shield', label: 'Shield (Governance & Ethics)', icon: renderSkillIcon('shield') },
  { value: 'trending', label: 'Trending (Growth Analytics)', icon: renderSkillIcon('trending') },
  { value: 'target', label: 'Target (Strategic Goals)', icon: renderSkillIcon('target') },
  { value: 'piechart', label: 'Pie Chart (Demographics)', icon: renderSkillIcon('piechart') },
  { value: 'cpu', label: 'CPU (Computing / Tech)', icon: renderSkillIcon('cpu') },
  { value: 'book', label: 'Book (Academic Research)', icon: renderSkillIcon('book') },
  { value: 'kanban', label: 'Kanban (Project Management)', icon: renderSkillIcon('kanban') },
  { value: 'sparkles', label: 'Sparkles (Innovation)', icon: renderSkillIcon('sparkles') },
  { value: 'star', label: 'Star (Excellence)', icon: renderSkillIcon('star') },
];

const skillItemSchema = z.object({
  name: z.string().min(1, 'Skill name is required'),
  category: z.enum(['technical', 'professional']),
  icon: z.string().optional(),
  order: z.number(),
});

const headerFormSchema = z.object({
  badge: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
});

type SkillFormValues = z.infer<typeof skillItemSchema>;
type HeaderFormValues = z.infer<typeof headerFormSchema>;

export default function AdminSkillsPage() {
  const qc = useQueryClient();
  const [skillDrawerOpen, setSkillDrawerOpen] = useState(false);
  const [headerDrawerOpen, setHeaderDrawerOpen] = useState(false);
  const [editSkill, setEditSkill] = useState<(Skill & { _id: string }) | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Fetch all skills
  const { data: skills = [], isLoading: isSkillsLoading } = useQuery<(Skill & { _id: string })[]>({
    queryKey: ['admin-skills'],
    queryFn: async () => {
      const res = await api.get('/admin/skills');
      return res.data.data;
    },
  });

  // Fetch current profile for skillsSection header configuration
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = useQuery<any>({
    queryKey: ['admin-profile'],
    queryFn: async () => {
      const res = await api.get('/admin/profile');
      return res.data.data;
    },
  });

  // Form for Skill Item
  const {
    register: registerSkill,
    handleSubmit: handleSkillSubmit,
    reset: resetSkillForm,
    watch: watchSkill,
    control: skillControl,
    setValue: setSkillValue,
    formState: { errors: skillErrors, isSubmitting: isSkillSubmitting, isDirty: isSkillDirty },
  } = useForm<SkillFormValues>({
    resolver: zodResolver(skillItemSchema),
    defaultValues: {
      name: '',
      category: 'technical',
      icon: '',
      order: 0,
    },
  });

  // Form for Section Header
  const {
    register: registerHeader,
    handleSubmit: handleHeaderSubmit,
    reset: resetHeaderForm,
    watch: watchHeader,
    formState: { isSubmitting: isHeaderSubmitting, isDirty: isHeaderDirty },
  } = useForm<HeaderFormValues>({
    resolver: zodResolver(headerFormSchema),
    defaultValues: {
      badge: 'Competencies & Methodologies',
      title: 'Skills & Capabilities',
      description:
        'Quantitative analysis software, survey methodologies, media tools, and organizational governance capabilities.',
    },
  });

  const openCreateSkill = () => {
    setEditSkill(null);
    resetSkillForm({
      name: '',
      category: 'technical',
      icon: '',
      order: skills.length > 0 ? Math.max(...skills.map((s) => s.order || 0)) + 1 : 1,
    });
    setSkillDrawerOpen(true);
  };

  const openEditSkill = (skill: Skill & { _id: string }) => {
    setEditSkill(skill);
    resetSkillForm({
      name: skill.name,
      category: skill.category,
      icon: skill.icon || '',
      order: skill.order || 0,
    });
    setSkillDrawerOpen(true);
  };

  const openHeaderDrawer = () => {
    resetHeaderForm({
      badge: profile?.skillsSection?.badge || 'Competencies & Methodologies',
      title: profile?.skillsSection?.title || 'Skills & Capabilities',
      description:
        profile?.skillsSection?.description ||
        'Quantitative analysis software, survey methodologies, media tools, and organizational governance capabilities.',
    });
    setHeaderDrawerOpen(true);
  };

  // Skill Create / Update Mutation
  const saveSkillMutation = useMutation({
    mutationFn: async (data: SkillFormValues) => {
      if (editSkill) {
        return api.put(`/admin/skills/${editSkill._id}`, data);
      }
      return api.post('/admin/skills', data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-skills'] });
      qc.invalidateQueries({ queryKey: ['portfolio'] });
      toast.success(editSkill ? 'Skill updated successfully' : 'Skill created successfully');
      setSkillDrawerOpen(false);
      setEditSkill(null);
    },
    onError: () => {
      toast.error('Operation failed. Please check form inputs.');
    },
  });

  // Skill Delete Mutation
  const deleteSkillMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/admin/skills/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-skills'] });
      qc.invalidateQueries({ queryKey: ['portfolio'] });
      toast.success('Skill deleted successfully');
      setDeleteId(null);
    },
    onError: () => {
      toast.error('Delete failed. Please try again.');
    },
  });

  // Section Header Mutation
  const saveHeaderMutation = useMutation({
    mutationFn: async (data: HeaderFormValues) => {
      return api.put('/admin/profile', {
        ...profile,
        skillsSection: data,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-profile'] });
      qc.invalidateQueries({ queryKey: ['portfolio'] });
      toast.success('Skills Section Header updated successfully!');
      setHeaderDrawerOpen(false);
    },
    onError: () => {
      toast.error('Failed to update Section Header.');
    },
  });

  const onSkillSubmit = async (data: SkillFormValues) => {
    await saveSkillMutation.mutateAsync(data);
  };

  const onHeaderSubmit = async (data: HeaderFormValues) => {
    await saveHeaderMutation.mutateAsync(data);
  };

  const currentSkillName = watchSkill('name');
  const currentSkillCategory = watchSkill('category');
  const currentSkillIcon = watchSkill('icon');

  const currentHeaderBadge = profile?.skillsSection?.badge || 'Competencies & Methodologies';
  const currentHeaderTitle = profile?.skillsSection?.title || 'Skills & Capabilities';
  const currentHeaderDesc =
    profile?.skillsSection?.description ||
    'Quantitative analysis software, survey methodologies, media tools, and organizational governance capabilities.';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--fg)', letterSpacing: '-0.03em', marginBottom: '0.35rem' }}>
            Skills & Capabilities
          </h1>
          <p style={{ color: 'var(--fg-muted)', fontSize: '0.9rem', margin: 0 }}>
            Manage technical & professional competencies, customized vector icons, and section header copy.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={openHeaderDrawer}
            className="btn btn-outline"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.6rem 1.15rem',
              borderRadius: '10px',
              fontWeight: 650,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            <SlidersHorizontal size={14} />
            <span>Customize Header</span>
          </button>

          <button
            type="button"
            onClick={openCreateSkill}
            className="btn btn-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.6rem 1.25rem',
              borderRadius: '10px',
              fontWeight: 650,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            <Plus size={16} />
            <span>Add Skill</span>
          </button>
        </div>
      </div>

      {/* Live Header Preview Card */}
      <div className="card bezel-card" style={{ padding: '1.5rem 1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--fg)' }}>
            Live Section Header Preview
          </span>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)', backgroundColor: 'var(--accent-subtle)', padding: '0.2rem 0.6rem', borderRadius: '9999px', border: '1px solid var(--accent-border)' }}>
            Editable via Customize Header
          </span>
        </div>

        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)', backgroundColor: 'var(--accent-subtle)', border: '1px solid var(--accent-border)', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
            {currentHeaderBadge}
          </span>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--fg)', margin: '0.5rem 0 0.25rem', letterSpacing: '-0.02em' }}>
            {currentHeaderTitle}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--fg-muted)', margin: 0, maxWidth: '750px', lineHeight: 1.55 }}>
            {currentHeaderDesc}
          </p>
        </div>
      </div>

      {/* Skills List Grid */}
      {isSkillsLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.85rem' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '72px', borderRadius: '14px' }} />
          ))}
        </div>
      ) : skills.length === 0 ? (
        <div className="card bezel-card" style={{ textAlign: 'center', padding: '3.5rem 2rem', color: 'var(--fg-muted)' }}>
          <p style={{ marginBottom: '1.25rem', fontSize: '0.95rem' }}>No skills configured yet.</p>
          <button onClick={openCreateSkill} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', margin: '0 auto' }}>
            <Plus size={16} /> Create First Skill
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '0.85rem' }}>
          {skills.map((skill) => {
            const isTech = skill.category === 'technical';
            const icon = renderSkillIcon(skill.icon, skill.name, skill.category);

            return (
              <div
                key={skill._id}
                className="card bezel-card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '0.9rem 1.15rem',
                  backgroundColor: 'var(--bg-surface)',
                  transition: 'all 0.2s ease',
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
                  }}
                >
                  {icon}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--fg)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {skill.name}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.15rem' }}>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        color: isTech ? 'var(--accent)' : 'var(--fg-muted)',
                        textTransform: 'capitalize',
                      }}
                    >
                      {skill.category}
                    </span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--fg-muted)', opacity: 0.6 }}>
                      #{skill.order}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0 }}>
                  <button
                    onClick={() => openEditSkill(skill)}
                    className="btn btn-outline"
                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                    title="Edit skill"
                  >
                    <Pencil size={12} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setDeleteId(skill._id)}
                    className="btn btn-outline"
                    style={{ padding: '0.35rem 0.55rem', color: '#ef4444', borderColor: 'var(--border)' }}
                    title="Delete skill"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Drawer 1: Skill Item Create / Edit Drawer ─────────────────────── */}
      <Drawer open={skillDrawerOpen} onOpenChange={setSkillDrawerOpen}>
        <DrawerContent width="max-w-2xl">
          <form onSubmit={handleSkillSubmit(onSkillSubmit)} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            
            <DrawerHeader>
              <DrawerTitle>{editSkill ? 'Edit Skill' : 'Create New Skill'}</DrawerTitle>
              <DrawerDescription>
                Configure skill title, category, display order, and customized vector icon.
              </DrawerDescription>
            </DrawerHeader>

            <DrawerBody>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
                
                {/* Live Icon & Skill Card Preview */}
                <div style={{ padding: '1rem 1.25rem', backgroundColor: 'var(--bg-elevated)', borderRadius: '14px', border: '1px solid var(--border)' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--fg-muted)', marginBottom: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Live Preview in Portfolio Grid
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.75rem 1rem', backgroundColor: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        backgroundColor: currentSkillCategory === 'technical' ? 'var(--accent-subtle)' : 'var(--bg-elevated)',
                        border: currentSkillCategory === 'technical' ? '1px solid var(--accent-border)' : '1px solid var(--border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {renderSkillIcon(currentSkillIcon, currentSkillName, currentSkillCategory)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--fg)', margin: 0 }}>
                        {currentSkillName || 'Skill Title'}
                      </p>
                      <p style={{ fontSize: '0.7rem', color: currentSkillCategory === 'technical' ? 'var(--accent)' : 'var(--fg-muted)', textTransform: 'capitalize', margin: 0 }}>
                        {currentSkillCategory || 'technical'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Skill Name */}
                <div>
                  <label className="admin-label">Skill Name *</label>
                  <input
                    {...registerSkill('name')}
                    className="admin-input"
                    placeholder="e.g. SPSS Quantitative Analysis, Social Research Methods..."
                  />
                  {skillErrors.name && (
                    <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: '0.2rem 0 0' }}>
                      {skillErrors.name.message}
                    </p>
                  )}
                </div>

                {/* Custom Designed Category Select & Order Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label className="admin-label">Category *</label>
                    <Controller
                      name="category"
                      control={skillControl}
                      render={({ field }) => (
                        <CustomSelect
                          value={field.value}
                          onChange={(val) => field.onChange(val as 'technical' | 'professional')}
                          options={CATEGORY_OPTIONS}
                        />
                      )}
                    />
                  </div>

                  <div>
                    <label className="admin-label">Display Order (Sorting)</label>
                    <input
                      type="number"
                      {...registerSkill('order', { valueAsNumber: true })}
                      className="admin-input"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Custom Designed Icon Select */}
                <div>
                  <label className="admin-label">Custom Skill Icon</label>
                  <Controller
                    name="icon"
                    control={skillControl}
                    render={({ field }) => (
                      <CustomSelect
                        value={field.value || ''}
                        onChange={(val) => field.onChange(val)}
                        options={ICON_OPTIONS}
                        placeholder="Choose vector icon..."
                      />
                    )}
                  />
                </div>

                {/* Quick Icon Visual Palette */}
                <div>
                  <label className="admin-label" style={{ marginBottom: '0.5rem' }}>
                    Quick Icon Palette Picker
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(38px, 1fr))', gap: '0.45rem' }}>
                    {Object.keys(SKILL_ICON_MAP).map((iconKey) => {
                      const isSelected = currentSkillIcon === iconKey;
                      const IconComp = SKILL_ICON_MAP[iconKey];

                      return (
                        <button
                          key={iconKey}
                          type="button"
                          onClick={() => setSkillValue('icon', iconKey, { shouldDirty: true, shouldTouch: true, shouldValidate: true })}
                          title={iconKey}
                          style={{
                            height: '38px',
                            borderRadius: '10px',
                            border: isSelected ? '2px solid var(--accent)' : '1px solid var(--border)',
                            backgroundColor: isSelected ? 'var(--accent-subtle)' : 'var(--bg-surface)',
                            color: isSelected ? 'var(--accent)' : 'var(--fg)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <IconComp size={16} />
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            </DrawerBody>

            <DrawerFooter>
              <button
                type="button"
                onClick={() => setSkillDrawerOpen(false)}
                className="btn btn-outline"
                style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem', borderRadius: '10px' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isSkillDirty || isSkillSubmitting || saveSkillMutation.isPending}
                className="btn btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.55rem 1.5rem',
                  fontSize: '0.85rem',
                  borderRadius: '10px',
                  opacity: !isSkillDirty ? 0.45 : 1,
                  cursor: !isSkillDirty ? 'not-allowed' : 'pointer',
                  transition: 'opacity 0.15s ease',
                }}
              >
                {isSkillSubmitting || saveSkillMutation.isPending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Saving Skill...</span>
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    <span>Save Skill</span>
                  </>
                )}
              </button>
            </DrawerFooter>

          </form>
        </DrawerContent>
      </Drawer>

      {/* ─── Drawer 2: Section Header Customize Drawer ─────────────────────── */}
      <Drawer open={headerDrawerOpen} onOpenChange={setHeaderDrawerOpen}>
        <DrawerContent width="max-w-xl">
          <form onSubmit={handleHeaderSubmit(onHeaderSubmit)} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            
            <DrawerHeader>
              <DrawerTitle>Customize Skills Section Header</DrawerTitle>
              <DrawerDescription>
                Customize badge, main title, and descriptive subtitle shown above the skills grid.
              </DrawerDescription>
            </DrawerHeader>

            <DrawerBody>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label className="admin-label">Section Badge</label>
                  <input
                    {...registerHeader('badge')}
                    className="admin-input"
                    placeholder="Competencies & Methodologies"
                  />
                </div>

                <div>
                  <label className="admin-label">Section Title</label>
                  <input
                    {...registerHeader('title')}
                    className="admin-input"
                    placeholder="Skills & Capabilities"
                  />
                </div>

                <div>
                  <label className="admin-label">Section Subtitle / Description</label>
                  <textarea
                    {...registerHeader('description')}
                    className="admin-input"
                    rows={4}
                    style={{
                      height: 'auto',
                      minHeight: '100px',
                      padding: '0.75rem 0.95rem',
                      lineHeight: 1.6,
                    }}
                    placeholder="Quantitative analysis software, survey methodologies, media tools, and organizational governance capabilities."
                  />
                </div>
              </div>
            </DrawerBody>

            <DrawerFooter>
              <button
                type="button"
                onClick={() => setHeaderDrawerOpen(false)}
                className="btn btn-outline"
                style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem', borderRadius: '10px' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isHeaderDirty || isHeaderSubmitting || saveHeaderMutation.isPending}
                className="btn btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.55rem 1.5rem',
                  fontSize: '0.85rem',
                  borderRadius: '10px',
                  opacity: !isHeaderDirty ? 0.45 : 1,
                  cursor: !isHeaderDirty ? 'not-allowed' : 'pointer',
                  transition: 'opacity 0.15s ease',
                }}
              >
                {isHeaderSubmitting || saveHeaderMutation.isPending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Saving Header...</span>
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    <span>Save Header</span>
                  </>
                )}
              </button>
            </DrawerFooter>

          </form>
        </DrawerContent>
      </Drawer>

      {/* ─── Delete Confirmation Modal ────────────────────────────────────── */}
      <AnimatePresence>
        {deleteId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteId(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              role="alertdialog"
              aria-modal="true"
              aria-label="Confirm deletion"
              className="card fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm z-50 p-6 text-center shadow-2xl bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl"
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <AlertTriangle size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--fg)', marginBottom: '0.35rem' }}>
                Confirm Deletion
              </h3>
              <p style={{ color: 'var(--fg-muted)', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.4 }}>
                Are you sure you want to delete this skill? It will immediately be removed from your portfolio.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <button onClick={() => setDeleteId(null)} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                  Cancel
                </button>
                <button
                  onClick={() => deleteSkillMutation.mutate(deleteId!)}
                  disabled={deleteSkillMutation.isPending}
                  className="btn btn-primary"
                  style={{ backgroundColor: '#ef4444', borderColor: '#ef4444', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  {deleteSkillMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  <span>Delete Skill</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
