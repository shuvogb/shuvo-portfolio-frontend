'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
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
  BookCheck,
  Building,
  Calendar,
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
import type { Workshop } from '@/types/portfolio';

const workshopItemSchema = z.object({
  title: z.string().min(1, 'Workshop / certification title is required'),
  organizer: z.string().min(1, 'Organizing body is required'),
  year: z.number().min(1900).max(2100),
  description: z.string().optional(),
  imageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
  order: z.number(),
});

const headerFormSchema = z.object({
  badge: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
});

type WorkshopFormValues = z.infer<typeof workshopItemSchema>;
type HeaderFormValues = z.infer<typeof headerFormSchema>;

export default function AdminWorkshopsPage() {
  const qc = useQueryClient();
  const [wsDrawerOpen, setWsDrawerOpen] = useState(false);
  const [headerDrawerOpen, setHeaderDrawerOpen] = useState(false);
  const [editWorkshop, setEditWorkshop] = useState<(Workshop & { _id: string }) | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Fetch all workshops
  const { data: workshops = [], isLoading: isWsLoading } = useQuery<(Workshop & { _id: string })[]>({
    queryKey: ['admin-workshops'],
    queryFn: async () => {
      const res = await api.get('/admin/workshops');
      return res.data.data;
    },
  });

  // Fetch current profile for workshopsSection header configuration
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = useQuery<any>({
    queryKey: ['admin-profile'],
    queryFn: async () => {
      const res = await api.get('/admin/profile');
      return res.data.data;
    },
  });

  // Form for Workshop Item
  const {
    register: registerWs,
    handleSubmit: handleWsSubmit,
    reset: resetWsForm,
    watch: watchWs,
    formState: { errors: wsErrors, isSubmitting: isWsSubmitting, isDirty: isWsDirty },
  } = useForm<WorkshopFormValues>({
    resolver: zodResolver(workshopItemSchema),
    defaultValues: {
      title: '',
      organizer: '',
      year: new Date().getFullYear(),
      description: '',
      imageUrl: '',
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
      badge: 'Professional Development',
      title: 'Workshops & Certifications',
      description:
        'Specialized training programs in quantitative social methodology, field research ethics, climate negotiations, and leadership.',
    },
  });

  const openCreateWs = () => {
    setEditWorkshop(null);
    resetWsForm({
      title: '',
      organizer: '',
      year: new Date().getFullYear(),
      description: '',
      imageUrl: '',
      order: workshops.length > 0 ? Math.max(...workshops.map((w) => w.order || 0)) + 1 : 1,
    });
    setWsDrawerOpen(true);
  };

  const openEditWs = (ws: Workshop & { _id: string }) => {
    setEditWorkshop(ws);
    resetWsForm({
      title: ws.title,
      organizer: ws.organizer,
      year: ws.year,
      description: ws.description || '',
      imageUrl: ws.imageUrl || '',
      order: ws.order || 0,
    });
    setWsDrawerOpen(true);
  };

  const openHeaderDrawer = () => {
    resetHeaderForm({
      badge: profile?.workshopsSection?.badge || 'Professional Development',
      title: profile?.workshopsSection?.title || 'Workshops & Certifications',
      description:
        profile?.workshopsSection?.description ||
        'Specialized training programs in quantitative social methodology, field research ethics, climate negotiations, and leadership.',
    });
    setHeaderDrawerOpen(true);
  };

  // Workshop Create / Update Mutation
  const saveWsMutation = useMutation({
    mutationFn: async (data: WorkshopFormValues) => {
      const payload = {
        title: data.title,
        organizer: data.organizer,
        year: data.year,
        description: data.description,
        imageUrl: data.imageUrl,
        order: data.order,
      };

      if (editWorkshop) {
        return api.put(`/admin/workshops/${editWorkshop._id}`, payload);
      }
      return api.post('/admin/workshops', payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-workshops'] });
      qc.invalidateQueries({ queryKey: ['portfolio'] });
      toast.success(editWorkshop ? 'Workshop updated successfully' : 'Workshop record added successfully');
      setWsDrawerOpen(false);
      setEditWorkshop(null);
    },
    onError: () => {
      toast.error('Operation failed. Please check form fields.');
    },
  });

  // Workshop Delete Mutation
  const deleteWsMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/admin/workshops/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-workshops'] });
      qc.invalidateQueries({ queryKey: ['portfolio'] });
      toast.success('Workshop deleted successfully');
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
        workshopsSection: data,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-profile'] });
      qc.invalidateQueries({ queryKey: ['portfolio'] });
      toast.success('Workshops Section Header updated successfully!');
      setHeaderDrawerOpen(false);
    },
    onError: () => {
      toast.error('Failed to update Section Header.');
    },
  });

  const onWsSubmit = async (data: WorkshopFormValues) => {
    await saveWsMutation.mutateAsync(data);
  };

  const onHeaderSubmit = async (data: HeaderFormValues) => {
    await saveHeaderMutation.mutateAsync(data);
  };

  const currentTitle = watchWs('title');
  const currentOrg = watchWs('organizer');
  const currentYear = watchWs('year');
  const currentDesc = watchWs('description');
  const currentImg = watchWs('imageUrl');

  const currentHeaderBadge = profile?.workshopsSection?.badge || 'Professional Development';
  const currentHeaderTitle = profile?.workshopsSection?.title || 'Workshops & Certifications';
  const currentHeaderDesc =
    profile?.workshopsSection?.description ||
    'Specialized training programs in quantitative social methodology, field research ethics, climate negotiations, and leadership.';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--fg)', letterSpacing: '-0.03em', marginBottom: '0.35rem' }}>
            Workshops & Certifications
          </h1>
          <p style={{ color: 'var(--fg-muted)', fontSize: '0.9rem', margin: 0 }}>
            Manage specialized training programs, certificates, 3D showcase photos, and section header text.
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
            onClick={openCreateWs}
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
            <span>Add Workshop</span>
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

      {/* Workshops List */}
      {isWsLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '110px', borderRadius: '16px' }} />
          ))}
        </div>
      ) : workshops.length === 0 ? (
        <div className="card bezel-card" style={{ textAlign: 'center', padding: '3.5rem 2rem', color: 'var(--fg-muted)' }}>
          <p style={{ marginBottom: '1.25rem', fontSize: '0.95rem' }}>No workshops or training programs configured yet.</p>
          <button onClick={openCreateWs} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', margin: '0 auto' }}>
            <Plus size={16} /> Add First Workshop
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {workshops.map((ws) => (
            <div
              key={ws._id}
              className="card bezel-card"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                padding: '1.25rem 1.5rem',
                gap: '1.25rem',
                backgroundColor: 'var(--bg-surface)',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', gap: '1.25rem', flex: 1, minWidth: 0 }}>
                {ws.imageUrl && (
                  <div style={{ width: '80px', height: '65px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, backgroundColor: 'var(--bg-elevated)' }}>
                    <img src={ws.imageUrl} alt={ws.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--accent)',
                        fontWeight: 650,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        padding: '0.15rem 0.55rem',
                        borderRadius: '9999px',
                        backgroundColor: 'var(--accent-subtle)',
                        border: '1px solid var(--accent-border)',
                      }}
                    >
                      <Calendar size={11} />
                      <span>{ws.year}</span>
                    </span>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--fg)', margin: 0, lineHeight: 1.35 }}>
                      {ws.title}
                    </h3>
                  </div>

                  <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent)', fontWeight: 600, fontSize: '0.85rem', margin: '0 0 0.35rem' }}>
                    <Building size={13} />
                    <span>Organized by {ws.organizer}</span>
                  </p>

                  {ws.description && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--fg-muted)', margin: 0, lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {ws.description}
                    </p>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.45rem', flexShrink: 0, alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--fg-muted)', opacity: 0.6, marginRight: '0.35rem' }}>
                  #{ws.order}
                </span>
                <button
                  onClick={() => openEditWs(ws)}
                  className="btn btn-outline"
                  style={{ padding: '0.4rem 0.75rem', fontSize: '0.775rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Pencil size={12} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setDeleteId(ws._id)}
                  className="btn btn-outline"
                  style={{ padding: '0.4rem 0.6rem', color: '#ef4444', borderColor: 'var(--border)' }}
                  title="Delete workshop"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── Drawer 1: Workshop Item Create / Edit Drawer ──────────────── */}
      <Drawer open={wsDrawerOpen} onOpenChange={setWsDrawerOpen}>
        <DrawerContent width="max-w-2xl">
          <form onSubmit={handleWsSubmit(onWsSubmit)} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            
            <DrawerHeader>
              <DrawerTitle>{editWorkshop ? 'Edit Workshop & Training' : 'Add Workshop & Training'}</DrawerTitle>
              <DrawerDescription>
                Configure training program title, organizing body, year, certificate image, and description summary.
              </DrawerDescription>
            </DrawerHeader>

            <DrawerBody>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
                
                {/* Live Card Preview */}
                <div style={{ padding: '1rem 1.25rem', backgroundColor: 'var(--bg-elevated)', borderRadius: '14px', border: '1px solid var(--border)' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--fg-muted)', marginBottom: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Live Preview in 3D Showcase Card
                  </p>
                  <div style={{ padding: '1.15rem', backgroundColor: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '90px', height: '80px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, backgroundColor: 'var(--bg-elevated)' }}>
                      <img
                        src={currentImg || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=600&auto=format&fit=crop'}
                        alt="Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: '0.65rem', fontWeight: 650, color: 'var(--accent)', backgroundColor: 'var(--accent-subtle)', border: '1px solid var(--accent-border)', padding: '0.1rem 0.45rem', borderRadius: '9999px' }}>
                        {currentYear || '2024'}
                      </span>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--fg)', margin: '0.35rem 0 0.2rem', lineHeight: 1.3 }}>
                        {currentTitle || 'National Advocacy and Training Workshop...'}
                      </h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600, margin: '0 0 0.35rem' }}>
                        Organized by {currentOrg || 'Nature Conservation Management (NACOM)'}
                      </p>
                      <p style={{ fontSize: '0.725rem', color: 'var(--fg-muted)', margin: 0, lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {currentDesc || 'Specialized institutional training program focusing on practical methodology...'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Workshop Title */}
                <div>
                  <label className="admin-label">Workshop / Training Title *</label>
                  <input
                    {...registerWs('title')}
                    className="admin-input"
                    placeholder="e.g. National Advocacy and Training Workshop on Youth and Women Engagement..."
                  />
                  {wsErrors.title && (
                    <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: '0.2rem 0 0' }}>
                      {wsErrors.title.message}
                    </p>
                  )}
                </div>

                {/* Organizer & Year */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="admin-label">Organizing Body / Institution *</label>
                    <input
                      {...registerWs('organizer')}
                      className="admin-input"
                      placeholder="e.g. Nature Conservation Management (NACOM)"
                    />
                    {wsErrors.organizer && (
                      <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: '0.2rem 0 0' }}>
                        {wsErrors.organizer.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="admin-label">Year *</label>
                    <input
                      type="number"
                      {...registerWs('year', { valueAsNumber: true })}
                      className="admin-input"
                      placeholder="2024"
                    />
                    {wsErrors.year && (
                      <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: '0.2rem 0 0' }}>
                        {wsErrors.year.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Image URL & Display Order */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="admin-label">Photo / Certificate Image URL</label>
                    <input
                      {...registerWs('imageUrl')}
                      className="admin-input"
                      placeholder="https://images.unsplash.com/photo-..."
                    />
                    {wsErrors.imageUrl && (
                      <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: '0.2rem 0 0' }}>
                        {wsErrors.imageUrl.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="admin-label">Display Order</label>
                    <input
                      type="number"
                      {...registerWs('order', { valueAsNumber: true })}
                      className="admin-input"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Description Summary */}
                <div>
                  <label className="admin-label">Summary / Key Takeaways (Shown on Showcase Card)</label>
                  <textarea
                    {...registerWs('description')}
                    className="admin-input"
                    rows={3}
                    style={{
                      height: 'auto',
                      minHeight: '85px',
                      padding: '0.75rem 0.95rem',
                      lineHeight: 1.55,
                    }}
                    placeholder="e.g. Specialized institutional training program focusing on hands-on practical methodology, capacity development, and impactful field execution."
                  />
                </div>

              </div>
            </DrawerBody>

            <DrawerFooter>
              <button
                type="button"
                onClick={() => setWsDrawerOpen(false)}
                className="btn btn-outline"
                style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem', borderRadius: '10px' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isWsDirty || isWsSubmitting || saveWsMutation.isPending}
                className="btn btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.55rem 1.5rem',
                  fontSize: '0.85rem',
                  borderRadius: '10px',
                  opacity: !isWsDirty ? 0.45 : 1,
                  cursor: !isWsDirty ? 'not-allowed' : 'pointer',
                  transition: 'opacity 0.15s ease',
                }}
              >
                {isWsSubmitting || saveWsMutation.isPending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Saving Workshop...</span>
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    <span>Save Workshop</span>
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
              <DrawerTitle>Customize Workshops Section Header</DrawerTitle>
              <DrawerDescription>
                Customize badge, main title, and descriptive subtitle shown above the workshops showcase.
              </DrawerDescription>
            </DrawerHeader>

            <DrawerBody>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label className="admin-label">Section Badge</label>
                  <input
                    {...registerHeader('badge')}
                    className="admin-input"
                    placeholder="Professional Development"
                  />
                </div>

                <div>
                  <label className="admin-label">Section Title</label>
                  <input
                    {...registerHeader('title')}
                    className="admin-input"
                    placeholder="Workshops & Certifications"
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
                    placeholder="Specialized training programs in quantitative social methodology, field research ethics, climate negotiations, and leadership."
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
                Are you sure you want to delete this workshop record? It will immediately be removed from your portfolio.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <button onClick={() => setDeleteId(null)} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                  Cancel
                </button>
                <button
                  onClick={() => deleteWsMutation.mutate(deleteId!)}
                  disabled={deleteWsMutation.isPending}
                  className="btn btn-primary"
                  style={{ backgroundColor: '#ef4444', borderColor: '#ef4444', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  {deleteWsMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  <span>Delete Workshop</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
