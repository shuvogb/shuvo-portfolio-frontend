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
  Upload,
  ImageIcon,
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

const WORKSHOP_IMAGES: Record<string, string> = {
  climate: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1200&auto=format&fit=crop',
  marketing: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
  pollution: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=1200&auto=format&fit=crop',
  photo: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop',
  theatre: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=1200&auto=format&fit=crop',
};

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=1200&auto=format&fit=crop',
];

export function getWorkshopImage(ws: { title?: string; imageUrl?: string }, idx = 0): string {
  if (ws.imageUrl && ws.imageUrl.trim() !== '') return ws.imageUrl;
  const lowerTitle = (ws.title || '').toLowerCase();
  if (lowerTitle.includes('climate') || lowerTitle.includes('ndc') || lowerTitle.includes('net zero')) {
    return WORKSHOP_IMAGES.climate;
  }
  if (lowerTitle.includes('marketing') || lowerTitle.includes('digital')) {
    return WORKSHOP_IMAGES.marketing;
  }
  if (lowerTitle.includes('pollution') || lowerTitle.includes('lead') || lowerTitle.includes('youth leaders')) {
    return WORKSHOP_IMAGES.pollution;
  }
  if (lowerTitle.includes('photo') || lowerTitle.includes('capture') || lowerTitle.includes('reality')) {
    return WORKSHOP_IMAGES.photo;
  }
  if (lowerTitle.includes('theatre') || lowerTitle.includes('acting') || lowerTitle.includes('drama')) {
    return WORKSHOP_IMAGES.theatre;
  }
  return DEFAULT_IMAGES[idx % DEFAULT_IMAGES.length];
}

const workshopItemSchema = z.object({
  title: z.string().min(1, 'Workshop / certification title is required'),
  organizer: z.string().min(1, 'Organizing body is required'),
  year: z.number().min(1900).max(2100),
  description: z.string().optional(),
  imageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
  imageHeight: z.number().optional(),
  imageFit: z.string().optional(),
  order: z.number(),
});

const headerFormSchema = z.object({
  badge: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  certificateHeight: z.number().optional(),
  certificateFit: z.string().optional(),
});

type WorkshopFormValues = z.infer<typeof workshopItemSchema>;
type HeaderFormValues = z.infer<typeof headerFormSchema>;

export default function AdminWorkshopsPage() {
  const qc = useQueryClient();
  const [wsDrawerOpen, setWsDrawerOpen] = useState(false);
  const [headerDrawerOpen, setHeaderDrawerOpen] = useState(false);
  const [editWorkshop, setEditWorkshop] = useState<(Workshop & { _id: string }) | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

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
    setValue: setValueWs,
    formState: { errors: wsErrors, isSubmitting: isWsSubmitting, isDirty: isWsDirty },
  } = useForm<WorkshopFormValues>({
    resolver: zodResolver(workshopItemSchema),
    defaultValues: {
      title: '',
      organizer: '',
      year: new Date().getFullYear(),
      description: '',
      imageUrl: '',
      imageHeight: 260,
      imageFit: 'contain',
      order: 0,
    },
  });

  // Form for Section Header
  const {
    register: registerHeader,
    handleSubmit: handleHeaderSubmit,
    reset: resetHeaderForm,
    setValue: setValueHeader,
    watch: watchHeader,
    formState: { isSubmitting: isHeaderSubmitting, isDirty: isHeaderDirty },
  } = useForm<HeaderFormValues>({
    resolver: zodResolver(headerFormSchema),
    defaultValues: {
      badge: 'Professional Development',
      title: 'Workshops & Certifications',
      description:
        'Specialized training programs in quantitative social methodology, field research ethics, climate negotiations, and leadership.',
      certificateHeight: 340,
      certificateFit: 'contain',
    },
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const localUrl = URL.createObjectURL(file);
    setValueWs('imageUrl', localUrl, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  };

  const openCreateWs = () => {
    setEditWorkshop(null);
    setImageFile(null);
    resetWsForm({
      title: '',
      organizer: '',
      year: new Date().getFullYear(),
      description: '',
      imageUrl: '',
      imageHeight: 260,
      imageFit: 'contain',
      order: workshops.length > 0 ? Math.max(...workshops.map((w) => w.order || 0)) + 1 : 1,
    });
    setWsDrawerOpen(true);
  };

  const openEditWs = (ws: Workshop & { _id: string }, idx = 0) => {
    const wsImg = getWorkshopImage(ws, idx);
    setEditWorkshop(ws);
    setImageFile(null);
    resetWsForm({
      title: ws.title,
      organizer: ws.organizer,
      year: ws.year,
      description: ws.description || '',
      imageUrl: ws.imageUrl || wsImg,
      imageHeight: ws.imageHeight || 260,
      imageFit: ws.imageFit || 'contain',
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
      certificateHeight: profile?.workshopsSection?.certificateHeight || 340,
      certificateFit: profile?.workshopsSection?.certificateFit || 'contain',
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
        imageHeight: data.imageHeight || 260,
        imageFit: data.imageFit || 'cover',
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
      setImageFile(null);
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
    let finalImageUrl = data.imageUrl;

    if (imageFile) {
      try {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('altText', `Workshop image for ${data.title}`);

        const res = await api.post('/admin/media/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        finalImageUrl = res.data.data.url;
      } catch {
        toast.error('Failed to upload workshop image to Cloudinary. Please try again.');
        setUploading(false);
        return;
      } finally {
        setUploading(false);
      }
    }

    await saveWsMutation.mutateAsync({
      ...data,
      imageUrl: finalImageUrl,
    });
  };

  const onHeaderSubmit = async (data: HeaderFormValues) => {
    await saveHeaderMutation.mutateAsync(data);
  };

  const currentTitle = watchWs('title');
  const currentOrg = watchWs('organizer');
  const currentYear = watchWs('year');
  const currentDesc = watchWs('description');
  const currentImg = watchWs('imageUrl');
  const currentHeight = watchWs('imageHeight') || 260;
  const currentFit = watchWs('imageFit') || 'cover';

  const currentHeaderBadge = profile?.workshopsSection?.badge || 'Professional Development';
  const currentHeaderTitle = profile?.workshopsSection?.title || 'Workshops & Certifications';
  const currentHeaderDesc =
    profile?.workshopsSection?.description ||
    'Specialized training programs in quantitative social methodology, field research ethics, climate negotiations, and leadership.';
  const currentHeaderHeight = watchHeader('certificateHeight') || profile?.workshopsSection?.certificateHeight || 340;
  const currentHeaderFit = watchHeader('certificateFit') || profile?.workshopsSection?.certificateFit || 'cover';

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
          {workshops.map((ws, idx) => {
            const wsImg = getWorkshopImage(ws, idx);
            return (
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
                <div style={{ display: 'flex', gap: '1.25rem', flex: 1, minWidth: 0, alignItems: 'flex-start' }}>
                  {/* Certificate Photo Thumbnail */}
                  <div
                    style={{
                      width: '90px',
                      height: '72px',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      flexShrink: 0,
                      backgroundColor: 'var(--bg-elevated)',
                      border: '1px solid var(--border)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    }}
                  >
                    <img
                      src={wsImg}
                      alt={ws.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

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
                    onClick={() => openEditWs(ws, idx)}
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
            );
          })}
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
                
                {/* Live Card Preview (Image on Top with Real Certificate Proportions) */}
                <div style={{ padding: '1.15rem', backgroundColor: 'var(--bg-elevated)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--fg-muted)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Live Preview in Showcase Card
                    </p>
                    <span
                      style={{
                        fontSize: '0.725rem',
                        fontWeight: 700,
                        color: 'var(--accent)',
                        backgroundColor: 'var(--accent-subtle)',
                        border: '1px solid var(--accent-border)',
                        padding: '0.15rem 0.55rem',
                        borderRadius: '9999px',
                      }}
                    >
                      {currentHeight}px · {currentFit === 'contain' ? 'Contain (Uncropped)' : 'Cover (Fill)'}
                    </span>
                  </div>

                  {/* Framed Card with Certificate Image on Top */}
                  <div
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderRadius: '14px',
                      border: '1px solid var(--border)',
                      overflow: 'hidden',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    }}
                  >
                    {/* Top Certificate Image Frame with Outer Padding & Framing */}
                    <div
                      style={{
                        padding: '0.85rem 0.85rem 0.35rem 0.85rem',
                        backgroundColor: 'var(--bg-surface)',
                        transition: 'all 0.25s ease',
                      }}
                    >
                      <div
                        style={{
                          position: 'relative',
                          width: '100%',
                          height: `${currentHeight}px`,
                          backgroundColor: 'var(--bg-elevated)',
                          borderRadius: '12px',
                          border: '1px solid var(--border)',
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                          transition: 'height 0.25s ease',
                        }}
                      >
                        {currentFit === 'contain' && (
                          <img
                            src={currentImg || getWorkshopImage({ title: currentTitle }, 0)}
                            alt=""
                            aria-hidden="true"
                            style={{
                              position: 'absolute',
                              inset: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              filter: 'blur(20px)',
                              opacity: 0.25,
                              transform: 'scale(1.15)',
                              pointerEvents: 'none',
                            }}
                          />
                        )}
                        <img
                          src={currentImg || getWorkshopImage({ title: currentTitle }, 0)}
                          alt="Preview Certificate"
                          style={{
                            position: 'relative',
                            zIndex: 1,
                            width: '100%',
                            height: '100%',
                            objectFit: currentFit === 'contain' ? 'contain' : 'cover',
                            objectPosition: 'center',
                            padding: currentFit === 'contain' ? '0.75rem' : '0.45rem',
                            borderRadius: '11px',
                            transition: 'all 0.25s ease',
                          }}
                        />
                      </div>
                    </div>

                    {/* Bottom Details */}
                    <div style={{ padding: '1.25rem 1.35rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.45rem' }}>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            color: 'var(--accent)',
                            backgroundColor: 'var(--accent-subtle)',
                            border: '1px solid var(--accent-border)',
                            padding: '0.15rem 0.55rem',
                            borderRadius: '9999px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                          }}
                        >
                          <Calendar size={11} />
                          {currentYear || '2024'}
                        </span>
                      </div>

                      <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--fg)', margin: '0 0 0.35rem', lineHeight: 1.35 }}>
                        {currentTitle || 'National Advocacy and Training Workshop on Youth and Women Engagement...'}
                      </h4>

                      <p style={{ fontSize: '0.825rem', color: 'var(--accent)', fontWeight: 600, margin: '0 0 0.45rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Building size={13} />
                        <span>Organized by {currentOrg || 'Nature Conservation Management (NACOM)'}</span>
                      </p>

                      <p style={{ fontSize: '0.8rem', color: 'var(--fg-muted)', margin: 0, lineHeight: 1.55 }}>
                        {currentDesc || 'Specialized institutional training program focusing on practical methodology, capacity development, and impactful field execution.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Certificate Image Resizing & Framing Controls */}
                <div style={{ padding: '1.15rem 1.25rem', backgroundColor: 'var(--bg-elevated)', borderRadius: '14px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <label className="admin-label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <SlidersHorizontal size={14} />
                      <span>Certificate Image Height / Size</span>
                    </label>
                    <span
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: 'var(--accent)',
                        fontFamily: 'monospace',
                        backgroundColor: 'var(--accent-subtle)',
                        padding: '0.15rem 0.55rem',
                        borderRadius: '6px',
                        border: '1px solid var(--accent-border)',
                      }}
                    >
                      {currentHeight}px
                    </span>
                  </div>

                  {/* Range Slider */}
                  <input
                    type="range"
                    min={160}
                    max={450}
                    step={10}
                    value={currentHeight}
                    onChange={(e) => setValueWs('imageHeight', Number(e.target.value), { shouldDirty: true })}
                    style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer', marginBottom: '0.85rem' }}
                  />

                  {/* Quick Preset Buttons */}
                  <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    {[
                      { label: 'Compact (200px)', val: 200 },
                      { label: 'Standard (260px)', val: 260 },
                      { label: 'Large (320px)', val: 320 },
                      { label: 'Expanded (380px)', val: 380 },
                    ].map((preset) => (
                      <button
                        key={preset.val}
                        type="button"
                        onClick={() => setValueWs('imageHeight', preset.val, { shouldDirty: true })}
                        className="btn btn-outline"
                        style={{
                          fontSize: '0.725rem',
                          padding: '0.3rem 0.65rem',
                          borderRadius: '8px',
                          backgroundColor: currentHeight === preset.val ? 'var(--accent-subtle)' : undefined,
                          borderColor: currentHeight === preset.val ? 'var(--accent-border)' : undefined,
                          color: currentHeight === preset.val ? 'var(--accent)' : undefined,
                          fontWeight: currentHeight === preset.val ? 700 : 500,
                        }}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  {/* Framing Fit Mode Toggle */}
                  <div>
                    <label className="admin-label" style={{ fontSize: '0.775rem', marginBottom: '0.45rem' }}>
                      Certificate Framing / Fit Mode
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                      <button
                        type="button"
                        onClick={() => setValueWs('imageFit', 'cover', { shouldDirty: true })}
                        className="btn btn-outline"
                        style={{
                          fontSize: '0.8rem',
                          padding: '0.5rem',
                          borderRadius: '9px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.4rem',
                          backgroundColor: currentFit === 'cover' ? 'var(--accent-subtle)' : undefined,
                          borderColor: currentFit === 'cover' ? 'var(--accent)' : undefined,
                          color: currentFit === 'cover' ? 'var(--accent)' : undefined,
                          fontWeight: currentFit === 'cover' ? 700 : 500,
                        }}
                      >
                        <span>Cover (Fill Frame)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setValueWs('imageFit', 'contain', { shouldDirty: true })}
                        className="btn btn-outline"
                        style={{
                          fontSize: '0.8rem',
                          padding: '0.5rem',
                          borderRadius: '9px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.4rem',
                          backgroundColor: currentFit === 'contain' ? 'var(--accent-subtle)' : undefined,
                          borderColor: currentFit === 'contain' ? 'var(--accent)' : undefined,
                          color: currentFit === 'contain' ? 'var(--accent)' : undefined,
                          fontWeight: currentFit === 'contain' ? 700 : 500,
                        }}
                      >
                        <span>Contain (Full Certificate)</span>
                      </button>
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

                {/* Image Upload & Display Order */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', alignItems: 'start' }}>
                  <div>
                    <label className="admin-label">Photo / Certificate Image</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <label
                          className="btn btn-outline"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                            padding: '0.45rem 0.95rem',
                            fontSize: '0.8rem',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            flexShrink: 0,
                          }}
                        >
                          <Upload size={14} />
                          <span>{imageFile ? `Selected: ${imageFile.name}` : 'Upload Certificate Photo'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            style={{ display: 'none' }}
                          />
                        </label>
                        {imageFile && (
                          <button
                            type="button"
                            onClick={() => {
                              setImageFile(null);
                              setValueWs('imageUrl', editWorkshop?.imageUrl || '', { shouldDirty: true });
                            }}
                            className="btn btn-outline"
                            style={{ fontSize: '0.75rem', padding: '0.45rem 0.65rem', borderRadius: '8px', color: '#ef4444' }}
                          >
                            Clear
                          </button>
                        )}
                      </div>

                      <input
                        {...registerWs('imageUrl')}
                        className="admin-input"
                        placeholder="Or paste image URL (https://...)"
                      />
                    </div>
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
                disabled={!isWsDirty || isWsSubmitting || saveWsMutation.isPending || uploading}
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
                {isWsSubmitting || saveWsMutation.isPending || uploading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>{uploading ? 'Uploading Image...' : 'Saving Workshop...'}</span>
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
              <DrawerTitle>Customize Workshops Section & Display</DrawerTitle>
              <DrawerDescription>
                Customize badge, main title, descriptive subtitle, and default certificate sizing for the showcase.
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
                      minHeight: '90px',
                      padding: '0.75rem 0.95rem',
                      lineHeight: 1.6,
                    }}
                    placeholder="Specialized training programs in quantitative social methodology, field research ethics, climate negotiations, and leadership."
                  />
                </div>

                {/* Section Default Certificate Height & Fit */}
                <div style={{ padding: '1rem 1.15rem', backgroundColor: 'var(--bg-elevated)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                    <label className="admin-label" style={{ margin: 0 }}>Section Default Certificate Height</label>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent)', fontFamily: 'monospace' }}>
                      {currentHeaderHeight}px
                    </span>
                  </div>

                  <input
                    type="range"
                    min={200}
                    max={450}
                    step={10}
                    value={currentHeaderHeight}
                    onChange={(e) => setValueHeader('certificateHeight', Number(e.target.value), { shouldDirty: true })}
                    style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer', marginBottom: '0.75rem' }}
                  />

                  <div>
                    <label className="admin-label" style={{ fontSize: '0.75rem', marginBottom: '0.4rem' }}>Default Framing Fit Mode</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => setValueHeader('certificateFit', 'cover', { shouldDirty: true })}
                        className="btn btn-outline"
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.4rem',
                          backgroundColor: currentHeaderFit === 'cover' ? 'var(--accent-subtle)' : undefined,
                          borderColor: currentHeaderFit === 'cover' ? 'var(--accent)' : undefined,
                          color: currentHeaderFit === 'cover' ? 'var(--accent)' : undefined,
                          fontWeight: currentHeaderFit === 'cover' ? 700 : 500,
                        }}
                      >
                        Cover (Fill Frame)
                      </button>
                      <button
                        type="button"
                        onClick={() => setValueHeader('certificateFit', 'contain', { shouldDirty: true })}
                        className="btn btn-outline"
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.4rem',
                          backgroundColor: currentHeaderFit === 'contain' ? 'var(--accent-subtle)' : undefined,
                          borderColor: currentHeaderFit === 'contain' ? 'var(--accent)' : undefined,
                          color: currentHeaderFit === 'contain' ? 'var(--accent)' : undefined,
                          fontWeight: currentHeaderFit === 'contain' ? 700 : 500,
                        }}
                      >
                        Contain (Uncropped)
                      </button>
                    </div>
                  </div>
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
