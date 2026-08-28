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
  Trophy,
  Users,
  HeartHandshake,
  FileText,
  GraduationCap,
  Sun,
  Award,
  Building,
  Calendar,
  Image as ImageIcon,
  MapPin,
  AlertTriangle,
  Upload,
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
import { getAchievementDetails } from '@/lib/achievementsData';
import type { Achievement } from '@/types/portfolio';

const CATEGORY_OPTIONS: CustomSelectOption[] = [
  { value: 'Community Development', label: 'Community Development', icon: <Users size={16} /> },
  { value: 'Academic Research', label: 'Academic Research', icon: <FileText size={16} /> },
  { value: 'Livelihood Initiatives', label: 'Livelihood Initiatives', icon: <HeartHandshake size={16} /> },
  { value: 'Career Leadership', label: 'Career Leadership', icon: <GraduationCap size={16} /> },
  { value: 'Climate Justice', label: 'Climate Justice', icon: <Sun size={16} /> },
  { value: 'Youth Empowerment', label: 'Youth Empowerment', icon: <Award size={16} /> },
  { value: 'Operations & Management', label: 'Operations & Management', icon: <Building size={16} /> },
  { value: 'Institutional Leadership', label: 'Institutional Leadership', icon: <Calendar size={16} /> },
];

const achievementItemSchema = z.object({
  highlight: z.string().min(1, 'Highlight / short title is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Achievement summary description is required'),
  imageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
  location: z.string().optional(),
  organization: z.string().optional(),
  order: z.number(),
});

const headerFormSchema = z.object({
  badge: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
});

type AchievementFormValues = z.infer<typeof achievementItemSchema>;
type HeaderFormValues = z.infer<typeof headerFormSchema>;

export default function AdminAchievementsPage() {
  const qc = useQueryClient();
  const [achDrawerOpen, setAchDrawerOpen] = useState(false);
  const [headerDrawerOpen, setHeaderDrawerOpen] = useState(false);
  const [editAchievement, setEditAchievement] = useState<(Achievement & { _id: string }) | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Fetch all achievements
  const { data: achievements = [], isLoading: isAchsLoading } = useQuery<(Achievement & { _id: string })[]>({
    queryKey: ['admin-achievements'],
    queryFn: async () => {
      const res = await api.get('/admin/achievements');
      return res.data.data;
    },
  });

  // Fetch current profile for achievementsSection header configuration
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = useQuery<any>({
    queryKey: ['admin-profile'],
    queryFn: async () => {
      const res = await api.get('/admin/profile');
      return res.data.data;
    },
  });

  // Form for Achievement Item
  const {
    register: registerAch,
    handleSubmit: handleAchSubmit,
    reset: resetAchForm,
    watch: watchAch,
    setValue: setValueAch,
    control: achControl,
    formState: { errors: achErrors, isSubmitting: isAchSubmitting, isDirty: isAchDirty },
  } = useForm<AchievementFormValues>({
    resolver: zodResolver(achievementItemSchema),
    defaultValues: {
      highlight: '',
      category: 'Community Development',
      description: '',
      imageUrl: '',
      location: '',
      organization: '',
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
      badge: 'Impact & Milestones',
      title: 'Key Achievements',
      description:
        'Quantifiable leadership results, community development initiatives, and student organization stewardship. Click any card to view the dedicated field story.',
    },
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const localUrl = URL.createObjectURL(file);
    setValueAch('imageUrl', localUrl, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  };

  const openCreateAch = () => {
    setEditAchievement(null);
    setImageFile(null);
    resetAchForm({
      highlight: '',
      category: 'Community Development',
      description: '',
      imageUrl: '',
      location: '',
      organization: '',
      order: achievements.length > 0 ? Math.max(...achievements.map((a) => a.order || 0)) + 1 : 1,
    });
    setAchDrawerOpen(true);
  };

  const openEditAch = (ach: Achievement & { _id: string }, idx: number) => {
    const details = getAchievementDetails(ach, idx);
    setEditAchievement(ach);
    setImageFile(null);
    resetAchForm({
      highlight: ach.highlight || ach.title || details.highlight,
      category: ach.category || details.category,
      description: ach.description || '',
      imageUrl: ach.imageUrl || (ach.images && ach.images[0]) || details.images[0] || '',
      location: ach.location || details.location || '',
      organization: ach.organization || details.organization || '',
      order: ach.order || 0,
    });
    setAchDrawerOpen(true);
  };

  const openHeaderDrawer = () => {
    resetHeaderForm({
      badge: profile?.achievementsSection?.badge || 'Impact & Milestones',
      title: profile?.achievementsSection?.title || 'Key Achievements',
      description:
        profile?.achievementsSection?.description ||
        'Quantifiable leadership results, community development initiatives, and student organization stewardship. Click any card to view the dedicated field story.',
    });
    setHeaderDrawerOpen(true);
  };

  // Achievement Create / Update Mutation
  const saveAchMutation = useMutation({
    mutationFn: async (data: AchievementFormValues) => {
      const payload = {
        title: data.highlight,
        highlight: data.highlight,
        category: data.category,
        description: data.description,
        imageUrl: data.imageUrl,
        images: data.imageUrl ? [data.imageUrl] : [],
        location: data.location,
        organization: data.organization,
        order: data.order,
      };

      if (editAchievement) {
        return api.put(`/admin/achievements/${editAchievement._id}`, payload);
      }
      return api.post('/admin/achievements', payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-achievements'] });
      qc.invalidateQueries({ queryKey: ['portfolio'] });
      toast.success(editAchievement ? 'Achievement updated successfully' : 'Achievement added successfully');
      setImageFile(null);
      setAchDrawerOpen(false);
      setEditAchievement(null);
    },
    onError: () => {
      toast.error('Operation failed. Please check form fields.');
    },
  });

  // Achievement Delete Mutation
  const deleteAchMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/admin/achievements/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-achievements'] });
      qc.invalidateQueries({ queryKey: ['portfolio'] });
      toast.success('Achievement deleted successfully');
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
        achievementsSection: data,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-profile'] });
      qc.invalidateQueries({ queryKey: ['portfolio'] });
      toast.success('Achievements Section Header updated successfully!');
      setHeaderDrawerOpen(false);
    },
    onError: () => {
      toast.error('Failed to update Section Header.');
    },
  });

  const onAchSubmit = async (data: AchievementFormValues) => {
    let finalImageUrl = data.imageUrl;

    if (imageFile) {
      try {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('altText', `Achievement photo for ${data.highlight}`);

        const res = await api.post('/admin/media/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        finalImageUrl = res.data.data.url;
      } catch {
        toast.error('Failed to upload image. Please try again.');
        setUploading(false);
        return;
      } finally {
        setUploading(false);
      }
    }

    await saveAchMutation.mutateAsync({
      ...data,
      imageUrl: finalImageUrl,
    });
  };

  const onHeaderSubmit = async (data: HeaderFormValues) => {
    await saveHeaderMutation.mutateAsync(data);
  };

  const currentHighlight = watchAch('highlight');
  const currentCategory = watchAch('category');
  const currentDesc = watchAch('description');
  const currentImg = watchAch('imageUrl');

  const currentHeaderBadge = profile?.achievementsSection?.badge || 'Impact & Milestones';
  const currentHeaderTitle = profile?.achievementsSection?.title || 'Key Achievements';
  const currentHeaderDesc =
    profile?.achievementsSection?.description ||
    'Quantifiable leadership results, community development initiatives, and student organization stewardship. Click any card to view the dedicated field story.';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--fg)', letterSpacing: '-0.03em', marginBottom: '0.35rem' }}>
            Key Achievements & Impact
          </h1>
          <p style={{ color: 'var(--fg-muted)', fontSize: '0.9rem', margin: 0 }}>
            Manage quantifiable field milestones, community initiatives, photo thumbnails, and section header text.
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
            onClick={openCreateAch}
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
            <span>Add Achievement</span>
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

      {/* Achievements Grid List */}
      {isAchsLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '240px', borderRadius: '16px' }} />
          ))}
        </div>
      ) : achievements.length === 0 ? (
        <div className="card bezel-card" style={{ textAlign: 'center', padding: '3.5rem 2rem', color: 'var(--fg-muted)' }}>
          <p style={{ marginBottom: '1.25rem', fontSize: '0.95rem' }}>No key achievements configured yet.</p>
          <button onClick={openCreateAch} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', margin: '0 auto' }}>
            <Plus size={16} /> Add First Achievement
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {achievements.map((ach, idx) => {
            const details = getAchievementDetails(ach, idx);
            const IconComp = details.icon;

            return (
              <div
                key={ach._id}
                className="card bezel-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '1rem',
                  backgroundColor: 'var(--bg-surface)',
                  transition: 'all 0.2s ease',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  {/* Thumbnail Image Header */}
                  <div style={{ position: 'relative', height: '140px', width: '100%', borderRadius: '10px', overflow: 'hidden', backgroundColor: 'var(--bg-elevated)', marginBottom: '0.85rem' }}>
                    <img
                      src={details.images[0]}
                      alt={details.category}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)' }} />
                    <div style={{ position: 'absolute', top: '8px', left: '8px', display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.2rem 0.55rem', borderRadius: '9999px', backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.7rem', fontWeight: 600 }}>
                      <IconComp size={11} style={{ color: 'var(--accent)' }} />
                      <span>{details.category}</span>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--fg)', margin: '0 0 0.35rem', lineHeight: 1.35 }}>
                    {details.highlight}
                  </h3>

                  <p style={{ fontSize: '0.825rem', color: 'var(--fg-muted)', margin: 0, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {ach.description}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', marginTop: '0.85rem', borderTop: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--fg-muted)', opacity: 0.6 }}>
                    #{ach.order}
                  </span>

                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      onClick={() => openEditAch(ach, idx)}
                      className="btn btn-outline"
                      style={{ padding: '0.35rem 0.7rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      <Pencil size={12} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => setDeleteId(ach._id)}
                      className="btn btn-outline"
                      style={{ padding: '0.35rem 0.55rem', color: '#ef4444', borderColor: 'var(--border)' }}
                      title="Delete achievement"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Drawer 1: Achievement Item Create / Edit Drawer ──────────────── */}
      <Drawer open={achDrawerOpen} onOpenChange={setAchDrawerOpen}>
        <DrawerContent width="max-w-2xl">
          <form onSubmit={handleAchSubmit(onAchSubmit)} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            
            <DrawerHeader>
              <DrawerTitle>{editAchievement ? 'Edit Key Achievement' : 'Add Key Achievement'}</DrawerTitle>
              <DrawerDescription>
                Configure milestone highlight title, category theme, primary summary, location, and visual image.
              </DrawerDescription>
            </DrawerHeader>

            <DrawerBody>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
                
                {/* Live Card Preview */}
                <div style={{ padding: '1rem 1.25rem', backgroundColor: 'var(--bg-elevated)', borderRadius: '14px', border: '1px solid var(--border)' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--fg-muted)', marginBottom: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Live Preview in Portfolio Grid
                  </p>
                  <div style={{ maxWidth: '340px', padding: '0.85rem', backgroundColor: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <div style={{ position: 'relative', height: '130px', width: '100%', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'var(--bg-elevated)' }}>
                      <img
                        src={currentImg || 'https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=800&auto=format&fit=crop'}
                        alt="Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{ position: 'absolute', top: '8px', left: '8px', padding: '0.2rem 0.55rem', borderRadius: '9999px', backgroundColor: 'rgba(15, 23, 42, 0.85)', color: '#fff', fontSize: '0.65rem', fontWeight: 600 }}>
                        {currentCategory || 'Community Development'}
                      </div>
                    </div>

                    <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--fg)', margin: 0, lineHeight: 1.3 }}>
                      {currentHighlight || '20 Families Supported'}
                    </h4>

                    <p style={{ fontSize: '0.75rem', color: 'var(--fg-muted)', margin: 0, lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {currentDesc || 'Conducted a land survey and coordinated distribution of livestock and poultry...'}
                    </p>
                  </div>
                </div>

                {/* Highlight Title & Category */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label className="admin-label">Milestone Highlight / Title *</label>
                    <input
                      {...registerAch('highlight')}
                      className="admin-input"
                      placeholder="e.g. 20 Families Supported or Quantitative Methodology"
                    />
                    {achErrors.highlight && (
                      <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: '0.2rem 0 0' }}>
                        {achErrors.highlight.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="admin-label">Category Theme *</label>
                    <Controller
                      name="category"
                      control={achControl}
                      render={({ field }) => (
                        <CustomSelect
                          value={field.value}
                          onChange={(val) => field.onChange(val)}
                          options={CATEGORY_OPTIONS}
                        />
                      )}
                    />
                  </div>
                </div>

                {/* Description Summary */}
                <div>
                  <label className="admin-label">Summary / Description (Shown on Card) *</label>
                  <textarea
                    {...registerAch('description')}
                    className="admin-input"
                    rows={3}
                    style={{
                      height: 'auto',
                      minHeight: '85px',
                      padding: '0.75rem 0.95rem',
                      lineHeight: 1.55,
                    }}
                    placeholder="e.g. Conducted a land survey and coordinated distribution of livestock and poultry to 20 families..."
                  />
                  {achErrors.description && (
                    <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: '0.2rem 0 0' }}>
                      {achErrors.description.message}
                    </p>
                  )}
                </div>

                {/* Image URL & Display Order */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', alignItems: 'start' }}>
                  <div>
                    <label className="admin-label">Card Feature Image</label>
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
                          <span>{imageFile ? `Selected: ${imageFile.name}` : 'Upload Photo'}</span>
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
                              setValueAch('imageUrl', editAchievement?.imageUrl || '', { shouldDirty: true });
                            }}
                            className="btn btn-outline"
                            style={{ fontSize: '0.75rem', padding: '0.45rem 0.65rem', borderRadius: '8px', color: '#ef4444' }}
                          >
                            Clear
                          </button>
                        )}
                      </div>

                      <input
                        {...registerAch('imageUrl')}
                        className="admin-input"
                        placeholder="Or paste image URL (https://...)"
                      />
                    </div>
                    {achErrors.imageUrl && (
                      <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: '0.2rem 0 0' }}>
                        {achErrors.imageUrl.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="admin-label">Display Order</label>
                    <input
                      type="number"
                      {...registerAch('order', { valueAsNumber: true })}
                      className="admin-input"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Location & Organization */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label className="admin-label">Location</label>
                    <input
                      {...registerAch('location')}
                      className="admin-input"
                      placeholder="e.g. Rasulpur Char, Gaibandha District"
                    />
                  </div>

                  <div>
                    <label className="admin-label">Organization</label>
                    <input
                      {...registerAch('organization')}
                      className="admin-input"
                      placeholder="e.g. Community Field Initiative"
                    />
                  </div>
                </div>

              </div>
            </DrawerBody>

            <DrawerFooter>
              <button
                type="button"
                onClick={() => setAchDrawerOpen(false)}
                className="btn btn-outline"
                style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem', borderRadius: '10px' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isAchDirty || isAchSubmitting || saveAchMutation.isPending || uploading}
                className="btn btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.55rem 1.5rem',
                  fontSize: '0.85rem',
                  borderRadius: '10px',
                  opacity: !isAchDirty ? 0.45 : 1,
                  cursor: !isAchDirty ? 'not-allowed' : 'pointer',
                  transition: 'opacity 0.15s ease',
                }}
              >
                {isAchSubmitting || saveAchMutation.isPending || uploading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>{uploading ? 'Uploading Image...' : 'Saving Achievement...'}</span>
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    <span>Save Achievement</span>
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
              <DrawerTitle>Customize Achievements Section Header</DrawerTitle>
              <DrawerDescription>
                Customize badge, main title, and descriptive subtitle shown above the key achievements grid.
              </DrawerDescription>
            </DrawerHeader>

            <DrawerBody>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label className="admin-label">Section Badge</label>
                  <input
                    {...registerHeader('badge')}
                    className="admin-input"
                    placeholder="Impact & Milestones"
                  />
                </div>

                <div>
                  <label className="admin-label">Section Title</label>
                  <input
                    {...registerHeader('title')}
                    className="admin-input"
                    placeholder="Key Achievements"
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
                    placeholder="Quantifiable leadership results, community development initiatives, and student organization stewardship. Click any card to view the dedicated field story."
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
                Are you sure you want to delete this achievement? It will immediately be removed from your portfolio.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <button onClick={() => setDeleteId(null)} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                  Cancel
                </button>
                <button
                  onClick={() => deleteAchMutation.mutate(deleteId!)}
                  disabled={deleteAchMutation.isPending}
                  className="btn btn-primary"
                  style={{ backgroundColor: '#ef4444', borderColor: '#ef4444', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  {deleteAchMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
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
