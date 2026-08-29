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
  GraduationCap,
  Building2,
  Calendar,
  Award,
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
import type { Education } from '@/types/portfolio';

const educationItemSchema = z.object({
  degree: z.string().min(1, 'Degree or certificate name is required'),
  institution: z.string().min(1, 'Institution or board name is required'),
  result: z.string().min(1, 'Result / CGPA is required'),
  startDate: z.string().min(1, 'Start date / year is required'),
  endDate: z.string().optional(),
  isCurrent: z.boolean(),
  order: z.number(),
});

const headerFormSchema = z.object({
  badge: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
});

type EducationFormValues = z.infer<typeof educationItemSchema>;
type HeaderFormValues = z.infer<typeof headerFormSchema>;

export default function AdminEducationPage() {
  const qc = useQueryClient();
  const [eduDrawerOpen, setEduDrawerOpen] = useState(false);
  const [headerDrawerOpen, setHeaderDrawerOpen] = useState(false);
  const [editEducation, setEditEducation] = useState<(Education & { _id: string }) | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Fetch all education records
  const { data: educations = [], isLoading: isEduLoading } = useQuery<(Education & { _id: string })[]>({
    queryKey: ['admin-education'],
    queryFn: async () => {
      const res = await api.get('/admin/education');
      return res.data.data;
    },
  });

  // Fetch current profile for educationSection header configuration
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = useQuery<any>({
    queryKey: ['admin-profile'],
    queryFn: async () => {
      const res = await api.get('/admin/profile');
      return res.data.data;
    },
  });

  // Form for Education Item
  const {
    register: registerEdu,
    control: eduControl,
    handleSubmit: handleEduSubmit,
    reset: resetEduForm,
    watch: watchEdu,
    formState: { errors: eduErrors, isSubmitting: isEduSubmitting, isDirty: isEduDirty },
  } = useForm<EducationFormValues>({
    resolver: zodResolver(educationItemSchema),
    defaultValues: {
      degree: '',
      institution: '',
      result: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      order: 0,
    },
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
      badge: 'Academic Foundation',
      title: 'Education & Credentials',
      description:
        'Formal degrees in sociology and social work, foundational academic performance, and institutional credentials.',
    },
  });

  const openCreateEdu = () => {
    setEditEducation(null);
    resetEduForm({
      degree: '',
      institution: '',
      result: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      order: educations.length > 0 ? Math.max(...educations.map((e) => e.order || 0)) + 1 : 1,
    });
    setEduDrawerOpen(true);
  };

  const openEditEdu = (edu: Education & { _id: string }) => {
    setEditEducation(edu);
    resetEduForm({
      degree: edu.degree,
      institution: edu.institution,
      result: edu.result,
      startDate: edu.startDate,
      endDate: edu.endDate || '',
      isCurrent: edu.isCurrent || false,
      order: edu.order || 0,
    });
    setEduDrawerOpen(true);
  };

  const openHeaderDrawer = () => {
    resetHeaderForm({
      badge: profile?.educationSection?.badge || 'Academic Foundation',
      title: profile?.educationSection?.title || 'Education & Credentials',
      description:
        profile?.educationSection?.description ||
        'Formal degrees in sociology and social work, foundational academic performance, and institutional credentials.',
    });
    setHeaderDrawerOpen(true);
  };

  // Education Create / Update Mutation
  const saveEduMutation = useMutation({
    mutationFn: async (data: EducationFormValues) => {
      const payload = {
        degree: data.degree,
        institution: data.institution,
        result: data.result,
        startDate: data.startDate,
        endDate: data.isCurrent ? '' : data.endDate,
        isCurrent: data.isCurrent,
        order: data.order,
      };

      if (editEducation) {
        return api.put(`/admin/education/${editEducation._id}`, payload);
      }
      return api.post('/admin/education', payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-education'] });
      qc.invalidateQueries({ queryKey: ['portfolio'] });
      toast.success(editEducation ? 'Education updated successfully' : 'Education record created successfully');
      setEduDrawerOpen(false);
      setEditEducation(null);
    },
    onError: () => {
      toast.error('Operation failed. Please check form fields.');
    },
  });

  // Education Delete Mutation
  const deleteEduMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/admin/education/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-education'] });
      qc.invalidateQueries({ queryKey: ['portfolio'] });
      toast.success('Education record deleted successfully');
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
        educationSection: data,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-profile'] });
      qc.invalidateQueries({ queryKey: ['portfolio'] });
      toast.success('Education Section Header updated successfully!');
      setHeaderDrawerOpen(false);
    },
    onError: () => {
      toast.error('Failed to update Section Header.');
    },
  });

  const onEduSubmit = async (data: EducationFormValues) => {
    await saveEduMutation.mutateAsync(data);
  };

  const onHeaderSubmit = async (data: HeaderFormValues) => {
    await saveHeaderMutation.mutateAsync(data);
  };

  const currentDegree = watchEdu('degree');
  const currentInst = watchEdu('institution');
  const currentResult = watchEdu('result');
  const currentStart = watchEdu('startDate');
  const currentEnd = watchEdu('endDate');
  const currentIsCurrent = watchEdu('isCurrent');

  const currentHeaderBadge = profile?.educationSection?.badge || 'Academic Foundation';
  const currentHeaderTitle = profile?.educationSection?.title || 'Education & Credentials';
  const currentHeaderDesc =
    profile?.educationSection?.description ||
    'Formal degrees in sociology and social work, foundational academic performance, and institutional credentials.';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--fg)', letterSpacing: '-0.03em', marginBottom: '0.35rem' }}>
            Education & Credentials
          </h1>
          <p style={{ color: 'var(--fg-muted)', fontSize: '0.9rem', margin: 0 }}>
            Manage academic degrees, institutions, GPA results, and section header text.
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
            onClick={openCreateEdu}
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
            <span>Add Education</span>
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

      {/* Education Timeline Records List */}
      {isEduLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '100px', borderRadius: '16px' }} />
          ))}
        </div>
      ) : educations.length === 0 ? (
        <div className="card bezel-card" style={{ textAlign: 'center', padding: '3.5rem 2rem', color: 'var(--fg-muted)' }}>
          <p style={{ marginBottom: '1.25rem', fontSize: '0.95rem' }}>No education records configured yet.</p>
          <button onClick={openCreateEdu} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', margin: '0 auto' }}>
            <Plus size={16} /> Add First Degree
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {educations.map((edu) => (
            <div
              key={edu._id}
              className="card bezel-card admin-card-item"
            >
              <div style={{ flex: 1, minWidth: 0, width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <GraduationCap size={16} style={{ color: 'var(--accent)' }} />
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--fg)', margin: 0 }}>
                      {edu.degree}
                    </h3>
                  </div>
                  {edu.isCurrent && (
                    <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                      Currently Enrolled
                    </span>
                  )}
                </div>

                <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent)', fontWeight: 650, fontSize: '0.875rem', margin: '0 0 0.65rem' }}>
                  <Building2 size={14} />
                  <span>{edu.institution}</span>
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--fg-muted)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <Calendar size={11} style={{ color: 'var(--accent)' }} />
                    <span>{edu.startDate} – {edu.isCurrent ? 'Present' : edu.endDate || 'N/A'}</span>
                  </span>

                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--accent)',
                      fontWeight: 650,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.15rem 0.55rem',
                      borderRadius: '9999px',
                      backgroundColor: 'var(--accent-subtle)',
                      border: '1px solid var(--accent-border)',
                    }}
                  >
                    <Award size={11} />
                    <span>{edu.result}</span>
                  </span>
                </div>
              </div>

              <div className="admin-card-item-actions">
                <span style={{ fontSize: '0.75rem', color: 'var(--fg-muted)', opacity: 0.6, marginRight: '0.35rem' }}>
                  #{edu.order}
                </span>
                <button
                  onClick={() => openEditEdu(edu)}
                  className="btn btn-outline"
                  style={{ padding: '0.45rem 0.85rem', fontSize: '0.775rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Pencil size={12} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setDeleteId(edu._id)}
                  className="btn btn-outline"
                  style={{ padding: '0.45rem 0.65rem', color: '#ef4444', borderColor: 'var(--border)' }}
                  title="Delete education record"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── Drawer 1: Education Item Create / Edit Drawer ──────────────── */}
      <Drawer open={eduDrawerOpen} onOpenChange={setEduDrawerOpen}>
        <DrawerContent width="max-w-2xl">
          <form onSubmit={handleEduSubmit(onEduSubmit)} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            
            <DrawerHeader>
              <DrawerTitle>{editEducation ? 'Edit Education Record' : 'Add Education Record'}</DrawerTitle>
              <DrawerDescription>
                Configure degree or certificate title, university name, academic result, and enrollment dates.
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
                      <GraduationCap size={16} style={{ color: 'var(--accent)' }} />
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--fg)', margin: 0 }}>
                        {currentDegree || 'Degree / Certificate Title'}
                      </h4>
                      {currentIsCurrent && (
                        <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>
                          Currently Enrolled
                        </span>
                      )}
                    </div>

                    <p style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent)', fontWeight: 650, fontSize: '0.8rem', margin: '0 0 0.5rem' }}>
                      <Building2 size={12} />
                      <span>{currentInst || 'Institution / Board'}</span>
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--fg-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Calendar size={10} style={{ color: 'var(--accent)' }} />
                        <span>{currentStart || 'Start'} – {currentIsCurrent ? 'Present' : currentEnd || 'End'}</span>
                      </span>

                      {currentResult && (
                        <span style={{ fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 650, display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.1rem 0.45rem', borderRadius: '9999px', backgroundColor: 'var(--accent-subtle)', border: '1px solid var(--accent-border)' }}>
                          <Award size={10} />
                          <span>{currentResult}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Degree & Institution */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label className="admin-label">Degree / Certificate Name *</label>
                    <input
                      {...registerEdu('degree')}
                      className="admin-input"
                      placeholder="e.g. BSS in Sociology and Social Work"
                    />
                    {eduErrors.degree && (
                      <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: '0.2rem 0 0' }}>
                        {eduErrors.degree.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="admin-label">Institution / University *</label>
                    <input
                      {...registerEdu('institution')}
                      className="admin-input"
                      placeholder="e.g. Gono Bishwabidyalay"
                    />
                    {eduErrors.institution && (
                      <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: '0.2rem 0 0' }}>
                        {eduErrors.institution.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Result / CGPA */}
                <div>
                  <label className="admin-label">Result / CGPA / Division *</label>
                  <input
                    {...registerEdu('result')}
                    className="admin-input"
                    placeholder="e.g. CGPA 3.47/4.00 (2nd Year, 4th Semester) or GPA 4.83/5.00"
                  />
                  {eduErrors.result && (
                    <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: '0.2rem 0 0' }}>
                      {eduErrors.result.message}
                    </p>
                  )}
                </div>

                {/* Dates & Order */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
                  <div>
                    <label className="admin-label">Start Date / Year *</label>
                    <input
                      {...registerEdu('startDate')}
                      className="admin-input"
                      placeholder="e.g. Jul 2023 or 2020"
                    />
                    {eduErrors.startDate && (
                      <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: '0.2rem 0 0' }}>
                        {eduErrors.startDate.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="admin-label">End Date / Year</label>
                    <input
                      {...registerEdu('endDate')}
                      disabled={currentIsCurrent}
                      className="admin-input"
                      placeholder={currentIsCurrent ? 'Present (Enrolled)' : 'e.g. 2027 or 2022'}
                    />
                  </div>

                  <div>
                    <label className="admin-label">Display Order</label>
                    <input
                      type="number"
                      {...registerEdu('order', { valueAsNumber: true })}
                      className="admin-input"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Currently Enrolled Custom Checkbox */}
                <Controller
                  control={eduControl}
                  name="isCurrent"
                  render={({ field }) => (
                    <CustomCheckbox
                      label="Currently enrolled in this academic program"
                      description="Marks this degree as actively in progress"
                      checked={field.value}
                      onCheckedChange={(val) => field.onChange(val)}
                    />
                  )}
                />

              </div>
            </DrawerBody>

            <DrawerFooter>
              <button
                type="button"
                onClick={() => setEduDrawerOpen(false)}
                className="btn btn-outline"
                style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem', borderRadius: '10px' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isEduDirty || isEduSubmitting || saveEduMutation.isPending}
                className="btn btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.55rem 1.5rem',
                  fontSize: '0.85rem',
                  borderRadius: '10px',
                  opacity: !isEduDirty ? 0.45 : 1,
                  cursor: !isEduDirty ? 'not-allowed' : 'pointer',
                  transition: 'opacity 0.15s ease',
                }}
              >
                {isEduSubmitting || saveEduMutation.isPending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Saving Record...</span>
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    <span>Save Record</span>
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
              <DrawerTitle>Customize Education Section Header</DrawerTitle>
              <DrawerDescription>
                Customize badge, main title, and descriptive subtitle shown above the education records.
              </DrawerDescription>
            </DrawerHeader>

            <DrawerBody>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label className="admin-label">Section Badge</label>
                  <input
                    {...registerHeader('badge')}
                    className="admin-input"
                    placeholder="Academic Foundation"
                  />
                </div>

                <div>
                  <label className="admin-label">Section Title</label>
                  <input
                    {...registerHeader('title')}
                    className="admin-input"
                    placeholder="Education & Credentials"
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
                    placeholder="Formal degrees in sociology and social work, foundational academic performance, and institutional credentials."
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
                Are you sure you want to delete this education record? It will immediately be removed from your portfolio.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <button onClick={() => setDeleteId(null)} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                  Cancel
                </button>
                <button
                  onClick={() => deleteEduMutation.mutate(deleteId!)}
                  disabled={deleteEduMutation.isPending}
                  className="btn btn-primary"
                  style={{ backgroundColor: '#ef4444', borderColor: '#ef4444', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  {deleteEduMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  <span>Delete Record</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
