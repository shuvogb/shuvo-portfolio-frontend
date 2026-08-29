'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
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
  Building,
  Calendar,
  CheckCircle2,
  ChevronRight,
  AlertTriangle,
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
import { CustomCheckbox } from '@/components/ui/custom-checkbox';
import type { Experience } from '@/types/portfolio';

const experienceItemSchema = z.object({
  title: z.string().min(1, 'Job or role title is required'),
  organization: z.string().min(1, 'Organization name is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  isCurrent: z.boolean(),
  bullets: z.array(z.object({ text: z.string().min(1, 'Bullet text cannot be empty') })),
  order: z.number(),
});

const headerFormSchema = z.object({
  badge: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
});

type ExperienceFormValues = z.infer<typeof experienceItemSchema>;
type HeaderFormValues = z.infer<typeof headerFormSchema>;

export default function AdminExperiencePage() {
  const qc = useQueryClient();
  const [expDrawerOpen, setExpDrawerOpen] = useState(false);
  const [headerDrawerOpen, setHeaderDrawerOpen] = useState(false);
  const [editExperience, setEditExperience] = useState<(Experience & { _id: string }) | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Fetch all experience records
  const { data: experiences = [], isLoading: isExpLoading } = useQuery<(Experience & { _id: string })[]>({
    queryKey: ['admin-experience'],
    queryFn: async () => {
      const res = await api.get('/admin/experience');
      return res.data.data;
    },
  });

  // Fetch current profile for experienceSection header configuration
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = useQuery<any>({
    queryKey: ['admin-profile'],
    queryFn: async () => {
      const res = await api.get('/admin/profile');
      return res.data.data;
    },
  });

  // Form for Experience Item
  const {
    register: registerExp,
    handleSubmit: handleExpSubmit,
    reset: resetExpForm,
    watch: watchExp,
    control: expControl,
    formState: { errors: expErrors, isSubmitting: isExpSubmitting, isDirty: isExpDirty },
  } = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceItemSchema),
    defaultValues: {
      title: '',
      organization: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      bullets: [{ text: '' }],
      order: 0,
    },
  });

  const { fields: bulletFields, append: appendBullet, remove: removeBullet } = useFieldArray({
    control: expControl,
    name: 'bullets',
  });

  // Form for Section Header
  const {
    register: registerHeader,
    handleSubmit: handleHeaderSubmit,
    reset: resetHeaderForm,
    formState: { isSubmitting: isHeaderSubmitting, isDirty: isHeaderDirty },
  } = useForm<HeaderFormValues>({
    resolver: zodResolver(headerFormSchema),
    defaultValues: {
      badge: 'Leadership & Career',
      title: 'Work & Leadership Experience',
      description:
        'Hands-on track record in social research, event operations, student organization administration, and youth empowerment.',
    },
  });

  const openCreateExp = () => {
    setEditExperience(null);
    resetExpForm({
      title: '',
      organization: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      bullets: [{ text: '' }],
      order: experiences.length > 0 ? Math.max(...experiences.map((e) => e.order || 0)) + 1 : 1,
    });
    setExpDrawerOpen(true);
  };

  const openEditExp = (exp: Experience & { _id: string }) => {
    setEditExperience(exp);
    resetExpForm({
      title: exp.title,
      organization: exp.organization,
      startDate: exp.startDate,
      endDate: exp.endDate || '',
      isCurrent: exp.isCurrent || false,
      bullets:
        exp.bullets && exp.bullets.length > 0
          ? exp.bullets.map((b) => ({ text: b }))
          : [{ text: '' }],
      order: exp.order || 0,
    });
    setExpDrawerOpen(true);
  };

  const openHeaderDrawer = () => {
    resetHeaderForm({
      badge: profile?.experienceSection?.badge || 'Leadership & Career',
      title: profile?.experienceSection?.title || 'Work & Leadership Experience',
      description:
        profile?.experienceSection?.description ||
        'Hands-on track record in social research, event operations, student organization administration, and youth empowerment.',
    });
    setHeaderDrawerOpen(true);
  };

  // Experience Create / Update Mutation
  const saveExpMutation = useMutation({
    mutationFn: async (data: ExperienceFormValues) => {
      const payload = {
        title: data.title,
        organization: data.organization,
        startDate: data.startDate,
        endDate: data.isCurrent ? '' : data.endDate,
        isCurrent: data.isCurrent,
        bullets: data.bullets.map((b) => b.text.trim()).filter(Boolean),
        order: data.order,
      };

      if (editExperience) {
        return api.put(`/admin/experience/${editExperience._id}`, payload);
      }
      return api.post('/admin/experience', payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-experience'] });
      qc.invalidateQueries({ queryKey: ['portfolio'] });
      toast.success(editExperience ? 'Experience updated successfully' : 'Experience created successfully');
      setExpDrawerOpen(false);
      setEditExperience(null);
    },
    onError: () => {
      toast.error('Operation failed. Please check form fields.');
    },
  });

  // Experience Delete Mutation
  const deleteExpMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/admin/experience/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-experience'] });
      qc.invalidateQueries({ queryKey: ['portfolio'] });
      toast.success('Experience record deleted successfully');
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
        experienceSection: data,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-profile'] });
      qc.invalidateQueries({ queryKey: ['portfolio'] });
      toast.success('Experience Section Header updated successfully!');
      setHeaderDrawerOpen(false);
    },
    onError: () => {
      toast.error('Failed to update Section Header.');
    },
  });

  const onExpSubmit = async (data: ExperienceFormValues) => {
    await saveExpMutation.mutateAsync(data);
  };

  const onHeaderSubmit = async (data: HeaderFormValues) => {
    await saveHeaderMutation.mutateAsync(data);
  };

  const currentTitle = watchExp('title');
  const currentOrg = watchExp('organization');
  const currentStart = watchExp('startDate');
  const currentEnd = watchExp('endDate');
  const currentIsCurrent = watchExp('isCurrent');
  const currentBullets = watchExp('bullets') || [];

  const currentHeaderBadge = profile?.experienceSection?.badge || 'Leadership & Career';
  const currentHeaderTitle = profile?.experienceSection?.title || 'Work & Leadership Experience';
  const currentHeaderDesc =
    profile?.experienceSection?.description ||
    'Hands-on track record in social research, event operations, student organization administration, and youth empowerment.';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--fg)', letterSpacing: '-0.03em', marginBottom: '0.35rem' }}>
            Work & Leadership Experience
          </h1>
          <p style={{ color: 'var(--fg-muted)', fontSize: '0.9rem', margin: 0 }}>
            Manage career timeline milestones, key responsibility bullet points, and section header copy.
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
            onClick={openCreateExp}
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
            <span>Add Experience</span>
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

      {/* Experience Timeline Records List */}
      {isExpLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '110px', borderRadius: '16px' }} />
          ))}
        </div>
      ) : experiences.length === 0 ? (
        <div className="card bezel-card" style={{ textAlign: 'center', padding: '3.5rem 2rem', color: 'var(--fg-muted)' }}>
          <p style={{ marginBottom: '1.25rem', fontSize: '0.95rem' }}>No experience records configured yet.</p>
          <button onClick={openCreateExp} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', margin: '0 auto' }}>
            <Plus size={16} /> Create First Experience
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {experiences.map((exp) => (
            <div
              key={exp._id}
              className="card bezel-card admin-card-item"
            >
              <div style={{ flex: 1, minWidth: 0, width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--fg)', margin: 0 }}>
                    {exp.title}
                  </h3>
                  {exp.isCurrent && (
                    <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                      <CheckCircle2 size={11} strokeWidth={2} /> Current Role
                    </span>
                  )}
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--fg-muted)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '9999px',
                      backgroundColor: 'var(--bg-elevated)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <Calendar size={11} style={{ color: 'var(--accent)' }} />
                    <span>{exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate || 'N/A'}</span>
                  </span>
                </div>

                <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent)', fontWeight: 650, fontSize: '0.875rem', margin: '0 0 0.65rem' }}>
                  <Building size={14} />
                  <span>{exp.organization}</span>
                </p>

                {exp.bullets && exp.bullets.length > 0 && (
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {exp.bullets.map((b, bIdx) => (
                      <li key={bIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem', fontSize: '0.8rem', color: 'var(--fg-muted)', lineHeight: 1.45 }}>
                        <ChevronRight size={12} strokeWidth={2.5} style={{ color: 'var(--accent)', marginTop: '2px', flexShrink: 0 }} />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="admin-card-item-actions">
                <span style={{ fontSize: '0.75rem', color: 'var(--fg-muted)', opacity: 0.6, marginRight: '0.35rem' }}>
                  #{exp.order}
                </span>
                <button
                  onClick={() => openEditExp(exp)}
                  className="btn btn-outline"
                  style={{ padding: '0.45rem 0.85rem', fontSize: '0.775rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Pencil size={12} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setDeleteId(exp._id)}
                  className="btn btn-outline"
                  style={{ padding: '0.45rem 0.65rem', color: '#ef4444', borderColor: 'var(--border)' }}
                  title="Delete experience"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── Drawer 1: Experience Item Create / Edit Drawer ──────────────── */}
      <Drawer open={expDrawerOpen} onOpenChange={setExpDrawerOpen}>
        <DrawerContent width="max-w-2xl">
          <form onSubmit={handleExpSubmit(onExpSubmit)} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            
            <DrawerHeader>
              <DrawerTitle>{editExperience ? 'Edit Experience Milestone' : 'Add Experience Milestone'}</DrawerTitle>
              <DrawerDescription>
                Configure position title, institution name, duration dates, current role state, and key responsibility bullets.
              </DrawerDescription>
            </DrawerHeader>

            <DrawerBody>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
                
                {/* Live Card Preview */}
                <div style={{ padding: '1rem 1.25rem', backgroundColor: 'var(--bg-elevated)', borderRadius: '14px', border: '1px solid var(--border)' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--fg-muted)', marginBottom: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Live Preview in Portfolio Timeline
                  </p>
                  <div style={{ padding: '1rem', backgroundColor: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--fg)', margin: 0 }}>
                        {currentTitle || 'Position / Role Title'}
                      </h4>
                      {currentIsCurrent && (
                        <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>
                          <CheckCircle2 size={10} strokeWidth={2} /> Current Role
                        </span>
                      )}
                      <span style={{ fontSize: '0.7rem', color: 'var(--fg-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.15rem 0.45rem', borderRadius: '9999px', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                        <Calendar size={10} style={{ color: 'var(--accent)' }} />
                        <span>{currentStart || 'Start'} – {currentIsCurrent ? 'Present' : currentEnd || 'End'}</span>
                      </span>
                    </div>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent)', fontWeight: 650, fontSize: '0.8rem', margin: '0 0 0.5rem' }}>
                      <Building size={12} />
                      <span>{currentOrg || 'Organization / Institution'}</span>
                    </p>
                    {currentBullets.filter((b) => b.text).length > 0 && (
                      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {currentBullets.filter((b) => b.text).map((b, i) => (
                          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--fg-muted)' }}>
                            <ChevronRight size={10} strokeWidth={2.5} style={{ color: 'var(--accent)', marginTop: '2px', flexShrink: 0 }} />
                            <span>{b.text}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Job Title & Organization */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label className="admin-label">Job / Role Title *</label>
                    <input
                      {...registerExp('title')}
                      className="admin-input"
                      placeholder="e.g. Assistant Organizing Secretary"
                    />
                    {expErrors.title && (
                      <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: '0.2rem 0 0' }}>
                        {expErrors.title.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="admin-label">Organization / Institution *</label>
                    <input
                      {...registerExp('organization')}
                      className="admin-input"
                      placeholder="e.g. Gono Bishwabidyalay Career Club"
                    />
                    {expErrors.organization && (
                      <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: '0.2rem 0 0' }}>
                        {expErrors.organization.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Dates & Current Role */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
                  <div>
                    <label className="admin-label">Start Date *</label>
                    <input
                      {...registerExp('startDate')}
                      className="admin-input"
                      placeholder="e.g. Feb 2026 or 2024-06"
                    />
                    {expErrors.startDate && (
                      <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: '0.2rem 0 0' }}>
                        {expErrors.startDate.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="admin-label">End Date</label>
                    <input
                      {...registerExp('endDate')}
                      disabled={currentIsCurrent}
                      className="admin-input"
                      placeholder={currentIsCurrent ? 'Present (Ongoing)' : 'e.g. Mar 2026'}
                    />
                  </div>

                  <div>
                    <label className="admin-label">Display Order</label>
                    <input
                      type="number"
                      {...registerExp('order', { valueAsNumber: true })}
                      className="admin-input"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Current Role Custom Checkbox */}
                <Controller
                  control={expControl}
                  name="isCurrent"
                  render={({ field }) => (
                    <CustomCheckbox
                      label="This is my current ongoing role"
                      description="Marks this position as active and in progress"
                      checked={field.value}
                      onCheckedChange={(val) => field.onChange(val)}
                    />
                  )}
                />

                {/* Bullet Points Manager */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div>
                      <label className="admin-label" style={{ margin: 0 }}>
                        Key Responsibilities & Accomplishment Bullets ({bulletFields.length})
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={() => appendBullet({ text: '' })}
                      className="btn btn-outline"
                      style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem', borderRadius: '8px' }}
                    >
                      <Plus size={13} />
                      <span>Add Bullet</span>
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {bulletFields.map((field, index) => (
                      <div key={field.id} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '6px',
                            backgroundColor: 'var(--accent-subtle)',
                            color: 'var(--accent)',
                            border: '1px solid var(--accent-border)',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {index + 1}
                        </span>
                        <input
                          {...registerExp(`bullets.${index}.text` as const)}
                          className="admin-input"
                          style={{ flex: 1 }}
                          placeholder="e.g. Coordinated planning and execution of programs..."
                        />
                        <button
                          type="button"
                          onClick={() => removeBullet(index)}
                          style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '0.4rem' }}
                          title="Delete bullet"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </DrawerBody>

            <DrawerFooter>
              <button
                type="button"
                onClick={() => setExpDrawerOpen(false)}
                className="btn btn-outline"
                style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem', borderRadius: '10px' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isExpDirty || isExpSubmitting || saveExpMutation.isPending}
                className="btn btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.55rem 1.5rem',
                  fontSize: '0.85rem',
                  borderRadius: '10px',
                  opacity: !isExpDirty ? 0.45 : 1,
                  cursor: !isExpDirty ? 'not-allowed' : 'pointer',
                  transition: 'opacity 0.15s ease',
                }}
              >
                {isExpSubmitting || saveExpMutation.isPending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Saving Experience...</span>
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    <span>Save Milestone</span>
                  </>
                )}
              </button>
            </DrawerFooter>

          </form>
        </DrawerContent>
      </Drawer>

      {/* ─── Drawer 2: Section Header Customize Drawer ─────────────────── */}
      <Drawer open={headerDrawerOpen} onOpenChange={setHeaderDrawerOpen}>
        <DrawerContent width="max-w-xl">
          <form onSubmit={handleHeaderSubmit(onHeaderSubmit)} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            
            <DrawerHeader>
              <DrawerTitle>Customize Experience Section Header</DrawerTitle>
              <DrawerDescription>
                Customize badge, main title, and descriptive subtitle shown above the experience timeline.
              </DrawerDescription>
            </DrawerHeader>

            <DrawerBody>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label className="admin-label">Section Badge</label>
                  <input
                    {...registerHeader('badge')}
                    className="admin-input"
                    placeholder="Leadership & Career"
                  />
                </div>

                <div>
                  <label className="admin-label">Section Title</label>
                  <input
                    {...registerHeader('title')}
                    className="admin-input"
                    placeholder="Work & Leadership Experience"
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
                    placeholder="Hands-on track record in social research, event operations, student organization administration, and youth empowerment."
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

      {/* ─── Delete Confirmation Modal ────────────────────────────────── */}
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
                Are you sure you want to delete this experience record? It will immediately be removed from your portfolio.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <button onClick={() => setDeleteId(null)} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                  Cancel
                </button>
                <button
                  onClick={() => deleteExpMutation.mutate(deleteId!)}
                  disabled={deleteExpMutation.isPending}
                  className="btn btn-primary"
                  style={{ backgroundColor: '#ef4444', borderColor: '#ef4444', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  {deleteExpMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  <span>Delete Milestone</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
