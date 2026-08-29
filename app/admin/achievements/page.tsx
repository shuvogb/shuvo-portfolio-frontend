'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  Loader2,
  SlidersHorizontal,
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
  Layers,
  Compass,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Check,
  ArrowLeft,
  ArrowRight,
  Eye,
  LayoutGrid,
  BookOpen,
  X,
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
  title: z.string().optional().or(z.literal('')),
  location: z.string().optional().or(z.literal('')),
  organization: z.string().optional().or(z.literal('')),
  scope: z.string().optional().or(z.literal('')),
  fullStory: z.string().optional().or(z.literal('')),
  images: z.array(z.string()),
  keyTakeaways: z.array(z.string()),
  order: z.number(),
});

const headerFormSchema = z.object({
  badge: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
});

type AchievementFormValues = z.infer<typeof achievementItemSchema>;
type HeaderFormValues = z.infer<typeof headerFormSchema>;

type DrawerTab = 'basics' | 'photos' | 'details' | 'preview';

interface StagedPhotoItem {
  id: string;
  url: string; // Blob URL for preview or existing Cloudinary/external URL
  file?: File; // Present if pending upload on form submit
}

export default function AdminAchievementsPage() {
  const qc = useQueryClient();
  const [achDrawerOpen, setAchDrawerOpen] = useState(false);
  const [headerDrawerOpen, setHeaderDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<DrawerTab>('basics');
  const [editAchievement, setEditAchievement] = useState<(Achievement & { _id: string }) | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isUploadingOnSave, setIsUploadingOnSave] = useState(false);
  const [uploadStatusText, setUploadStatusText] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newOutcomeText, setNewOutcomeText] = useState('');
  const [previewCarouselIdx, setPreviewCarouselIdx] = useState(0);

  // Staged Photos state (local previews + pending files before user clicks Save)
  const [stagedPhotos, setStagedPhotos] = useState<StagedPhotoItem[]>([]);

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
      title: '',
      location: '',
      organization: '',
      scope: '',
      fullStory: '',
      images: [],
      keyTakeaways: [],
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

  const currentKeyTakeaways = watchAch('keyTakeaways') || [];
  const currentHighlight = watchAch('highlight');
  const currentCategory = watchAch('category');
  const currentDesc = watchAch('description');
  const currentTitle = watchAch('title');
  const currentLocation = watchAch('location');
  const currentOrganization = watchAch('organization');
  const currentScope = watchAch('scope');
  const currentFullStory = watchAch('fullStory');

  // Stage multiple images locally without uploading immediately
  const handleMultipleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems: StagedPhotoItem[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      url: URL.createObjectURL(file),
      file: file,
    }));

    const updated = [...stagedPhotos, ...newItems];
    setStagedPhotos(updated);
    setValueAch('images', updated.map((item) => item.url), {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    toast.success(`Selected ${newItems.length} photo${newItems.length > 1 ? 's' : ''} (will upload on save)`);
    e.target.value = '';
  };

  // Add photo via direct URL
  const handleAddImageUrl = () => {
    const trimmed = newImageUrl.trim();
    if (!trimmed) return;
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      toast.error('Please enter a valid HTTP/HTTPS image URL');
      return;
    }

    const newItem: StagedPhotoItem = {
      id: Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      url: trimmed,
    };

    const updated = [...stagedPhotos, newItem];
    setStagedPhotos(updated);
    setValueAch('images', updated.map((item) => item.url), {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setNewImageUrl('');
    toast.success('Photo URL added to gallery');
  };

  // Remove photo from staged gallery
  const handleRemoveImage = (indexToRemove: number) => {
    const removedItem = stagedPhotos[indexToRemove];
    if (removedItem?.file && removedItem.url.startsWith('blob:')) {
      try {
        URL.revokeObjectURL(removedItem.url);
      } catch {}
    }

    const updated = stagedPhotos.filter((_, idx) => idx !== indexToRemove);
    setStagedPhotos(updated);
    setValueAch('images', updated.map((item) => item.url), {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    if (previewCarouselIdx >= updated.length) {
      setPreviewCarouselIdx(Math.max(0, updated.length - 1));
    }
  };

  // Set photo as primary cover (#1)
  const handleSetCoverImage = (index: number) => {
    if (index === 0) return;
    const selected = stagedPhotos[index];
    const remaining = stagedPhotos.filter((_, idx) => idx !== index);
    const reordered = [selected, ...remaining];
    setStagedPhotos(reordered);
    setValueAch('images', reordered.map((item) => item.url), {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setPreviewCarouselIdx(0);
    toast.success('Selected photo set as primary cover');
  };

  // Move photo left/right
  const handleMoveImage = (index: number, direction: 'left' | 'right') => {
    const newIdx = direction === 'left' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= stagedPhotos.length) return;
    const copy = [...stagedPhotos];
    const temp = copy[index];
    copy[index] = copy[newIdx];
    copy[newIdx] = temp;
    setStagedPhotos(copy);
    setValueAch('images', copy.map((item) => item.url), {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  // Outcome Bullets Management
  const handleAddOutcome = () => {
    const trimmed = newOutcomeText.trim();
    if (!trimmed) return;
    const updated = [...currentKeyTakeaways, trimmed];
    setValueAch('keyTakeaways', updated, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
    setNewOutcomeText('');
  };

  const handleRemoveOutcome = (idxToRemove: number) => {
    const updated = currentKeyTakeaways.filter((_, idx) => idx !== idxToRemove);
    setValueAch('keyTakeaways', updated, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  };

  const handleEditOutcome = (idx: number, newText: string) => {
    const updated = [...currentKeyTakeaways];
    updated[idx] = newText;
    setValueAch('keyTakeaways', updated, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  };

  const handleMoveOutcome = (idx: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= currentKeyTakeaways.length) return;
    const copy = [...currentKeyTakeaways];
    const temp = copy[idx];
    copy[idx] = copy[newIdx];
    copy[newIdx] = temp;
    setValueAch('keyTakeaways', copy, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  };

  const openCreateAch = () => {
    setEditAchievement(null);
    setActiveTab('basics');
    setNewImageUrl('');
    setNewOutcomeText('');
    setPreviewCarouselIdx(0);
    setStagedPhotos([]);

    resetAchForm({
      highlight: '',
      category: 'Community Development',
      description: '',
      title: '',
      location: '',
      organization: '',
      scope: '',
      fullStory: '',
      images: [],
      keyTakeaways: [],
      order: achievements.length > 0 ? Math.max(...achievements.map((a) => a.order || 0)) + 1 : 1,
    });
    setAchDrawerOpen(true);
  };

  const openEditAch = (ach: Achievement & { _id: string }, idx: number) => {
    const details = getAchievementDetails(ach, idx);
    setEditAchievement(ach);
    setActiveTab('basics');
    setNewImageUrl('');
    setNewOutcomeText('');
    setPreviewCarouselIdx(0);

    const existingImages = (ach.images && ach.images.length > 0)
      ? ach.images
      : (ach.imageUrl ? [ach.imageUrl] : details.images);

    const initialStaged: StagedPhotoItem[] = existingImages.map((url, i) => ({
      id: `existing-${i}-${url}`,
      url: url,
    }));
    setStagedPhotos(initialStaged);

    const existingTakeaways = (ach.keyTakeaways && ach.keyTakeaways.length > 0)
      ? ach.keyTakeaways
      : details.keyTakeaways;

    resetAchForm({
      highlight: ach.highlight || ach.title || details.highlight,
      category: ach.category || details.category,
      description: ach.description || '',
      title: ach.title || details.title || '',
      location: ach.location || details.location || '',
      organization: ach.organization || details.organization || '',
      scope: ach.scope || details.scope || '',
      fullStory: ach.fullStory || details.fullStory || '',
      images: existingImages,
      keyTakeaways: existingTakeaways,
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
      const primaryImg = data.images.length > 0 ? data.images[0] : '';
      const payload = {
        title: data.title || data.highlight,
        highlight: data.highlight,
        category: data.category,
        description: data.description,
        imageUrl: primaryImg,
        images: data.images,
        location: data.location,
        organization: data.organization,
        scope: data.scope,
        fullStory: data.fullStory,
        keyTakeaways: data.keyTakeaways,
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
      toast.success(editAchievement ? 'Achievement & Field Story updated successfully' : 'Achievement & Field Story added successfully');
      setAchDrawerOpen(false);
      setEditAchievement(null);
    },
    onError: () => {
      toast.error('Operation failed. Please verify form fields.');
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

  // Execute actual Cloudinary upload on form submit when clicking Save
  const onAchSubmit = async (data: AchievementFormValues) => {
    try {
      setIsUploadingOnSave(true);
      const finalImageUrls: string[] = [];
      const pendingUploads = stagedPhotos.filter((item) => !!item.file);
      let uploadedCount = 0;

      for (let i = 0; i < stagedPhotos.length; i++) {
        const item = stagedPhotos[i];

        if (item.file) {
          uploadedCount++;
          setUploadStatusText(`Uploading photo ${uploadedCount} of ${pendingUploads.length}...`);

          const formData = new FormData();
          formData.append('file', item.file);
          formData.append('altText', `Photo for achievement ${data.highlight || 'milestone'}`);

          const res = await api.post('/admin/media/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });

          if (res.data?.data?.url) {
            finalImageUrls.push(res.data.data.url);
          }
        } else {
          // Existing Cloudinary or external URL
          finalImageUrls.push(item.url);
        }
      }

      setUploadStatusText('Saving achievement data...');
      await saveAchMutation.mutateAsync({
        ...data,
        images: finalImageUrls,
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Submit error:', err);
      const msg = err?.response?.data?.message || 'Failed to save achievement. Please try again.';
      toast.error(msg);
    } finally {
      setIsUploadingOnSave(false);
      setUploadStatusText('');
    }
  };

  const onHeaderSubmit = async (data: HeaderFormValues) => {
    await saveHeaderMutation.mutateAsync(data);
  };

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
            Key Achievements & Field Stories
          </h1>
          <p style={{ color: 'var(--fg-muted)', fontSize: '0.9rem', margin: 0 }}>
            Manage quantifiable field milestones, multi-photo carousels, dedicated details pages, and section header text.
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
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
            const photoCount = (ach.images && ach.images.length > 0) ? ach.images.length : details.images.length;

            return (
              <div
                key={ach._id}
                className="card bezel-card admin-card-item"
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
                    
                    {/* Category Pill */}
                    <div style={{ position: 'absolute', top: '8px', left: '8px', display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.2rem 0.55rem', borderRadius: '9999px', backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.7rem', fontWeight: 600 }}>
                      <IconComp size={11} style={{ color: 'var(--accent)' }} />
                      <span>{details.category}</span>
                    </div>

                    {/* Photos Count Badge */}
                    <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.55rem', borderRadius: '9999px', backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.7rem', fontWeight: 600 }}>
                      <ImageIcon size={11} />
                      <span>{photoCount} {photoCount === 1 ? 'Photo' : 'Photos'}</span>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--fg)', margin: '0 0 0.35rem', lineHeight: 1.35 }}>
                    {details.highlight}
                  </h3>

                  <p style={{ fontSize: '0.825rem', color: 'var(--fg-muted)', margin: 0, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {ach.description}
                  </p>
                </div>

                <div className="admin-card-item-actions" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', marginTop: '0.85rem', borderTop: '1px solid var(--border)' }}>
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
                      <span>Edit & Story</span>
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
        <DrawerContent width="max-w-3xl">
          <form onSubmit={handleAchSubmit(onAchSubmit)} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            
            <DrawerHeader>
              <DrawerTitle>{editAchievement ? 'Edit Key Achievement & Field Story' : 'Add Key Achievement & Field Story'}</DrawerTitle>
              <DrawerDescription>
                Manage card highlight summary, multi-photo gallery carousel, and the dedicated full story details page.
              </DrawerDescription>

              {/* Navigation Tabs */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.85rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', overflowX: 'auto' }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('basics')}
                  className={`btn ${activeTab === 'basics' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ fontSize: '0.785rem', padding: '0.35rem 0.75rem', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', whiteSpace: 'nowrap' }}
                >
                  <LayoutGrid size={13} />
                  <span>1. Card Basics</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('photos')}
                  className={`btn ${activeTab === 'photos' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ fontSize: '0.785rem', padding: '0.35rem 0.75rem', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', whiteSpace: 'nowrap' }}
                >
                  <ImageIcon size={13} />
                  <span>2. Photos & Carousel ({stagedPhotos.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('details')}
                  className={`btn ${activeTab === 'details' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ fontSize: '0.785rem', padding: '0.35rem 0.75rem', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', whiteSpace: 'nowrap' }}
                >
                  <BookOpen size={13} />
                  <span>3. Field Story Details</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`btn ${activeTab === 'preview' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ fontSize: '0.785rem', padding: '0.35rem 0.75rem', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', whiteSpace: 'nowrap' }}
                >
                  <Eye size={13} />
                  <span>4. Live Details Preview</span>
                </button>
              </div>
            </DrawerHeader>

            <DrawerBody>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
                
                {/* ─── TAB 1: CARD BASICS ─── */}
                {activeTab === 'basics' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    
                    {/* Live Card Preview Box */}
                    <div style={{ padding: '1rem 1.25rem', backgroundColor: 'var(--bg-elevated)', borderRadius: '14px', border: '1px solid var(--border)' }}>
                      <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--fg-muted)', marginBottom: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Live Card Preview (Portfolio Grid)
                      </p>
                      <div style={{ maxWidth: '340px', padding: '0.85rem', backgroundColor: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                        <div style={{ position: 'relative', height: '130px', width: '100%', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'var(--bg-elevated)' }}>
                          <img
                            src={stagedPhotos[0]?.url || 'https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=800&auto=format&fit=crop'}
                            alt="Preview"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <div style={{ position: 'absolute', top: '8px', left: '8px', padding: '0.2rem 0.55rem', borderRadius: '9999px', backgroundColor: 'rgba(15, 23, 42, 0.85)', color: '#fff', fontSize: '0.65rem', fontWeight: 600 }}>
                            {currentCategory || 'Community Development'}
                          </div>
                          {stagedPhotos.length > 1 && (
                            <div style={{ position: 'absolute', top: '8px', right: '8px', padding: '0.2rem 0.55rem', borderRadius: '9999px', backgroundColor: 'rgba(15, 23, 42, 0.85)', color: '#fff', fontSize: '0.65rem', fontWeight: 600 }}>
                              {stagedPhotos.length} Photos
                            </div>
                          )}
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
                        <label className="admin-label">Milestone Highlight / Stat Title *</label>
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
                      <label className="admin-label">Summary / Description (Shown on Main Card) *</label>
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
                        placeholder="e.g. Conducted a land survey and coordinated distribution of livestock and poultry to 20 families as part of a community development initiative in Rasulpur Char..."
                      />
                      {achErrors.description && (
                        <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: '0.2rem 0 0' }}>
                          {achErrors.description.message}
                        </p>
                      )}
                    </div>

                    {/* Order */}
                    <div>
                      <label className="admin-label">Display Order</label>
                      <input
                        type="number"
                        {...registerAch('order', { valueAsNumber: true })}
                        className="admin-input"
                        placeholder="0"
                        style={{ maxWidth: '200px' }}
                      />
                    </div>

                  </div>
                )}

                {/* ─── TAB 2: MULTIPLE PHOTOS & CAROUSEL ─── */}
                {activeTab === 'photos' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    
                    {/* Multi-Photo Upload Dropzone Area */}
                    <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-elevated)', borderRadius: '14px', border: '1px dashed var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--accent-subtle)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Upload size={22} strokeWidth={2} />
                      </div>
                      
                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--fg)', margin: '0 0 0.25rem' }}>
                          Select Multiple Images for Showcase Carousel
                        </h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--fg-muted)', margin: 0 }}>
                          Select photos from your device. You can preview, reorder, and set the cover immediately. Photos upload securely when you click Save.
                        </p>
                      </div>

                      <label
                        className="btn btn-primary"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          padding: '0.55rem 1.25rem',
                          fontSize: '0.85rem',
                          borderRadius: '10px',
                          cursor: 'pointer',
                        }}
                      >
                        <Upload size={15} />
                        <span>Select Multiple Photos</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleMultipleImageSelect}
                          style={{ display: 'none' }}
                        />
                      </label>
                    </div>

                    {/* Add Image by Direct URL */}
                    <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
                      <input
                        type="url"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        placeholder="Or paste external image URL (https://images.unsplash.com/...)"
                        className="admin-input"
                        style={{ flex: 1 }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddImageUrl();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleAddImageUrl}
                        className="btn btn-outline"
                        style={{ padding: '0.6rem 1rem', fontSize: '0.8rem', borderRadius: '10px', whiteSpace: 'nowrap' }}
                      >
                        <Plus size={14} /> Add URL
                      </button>
                    </div>

                    {/* Photos Gallery List */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--fg)' }}>
                          Showcase Carousel Photos ({stagedPhotos.length})
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--fg-muted)' }}>
                          Photo #1 is the Cover. Use arrows to reorder.
                        </span>
                      </div>

                      {stagedPhotos.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--bg-elevated)', borderRadius: '12px', border: '1px solid var(--border)', color: 'var(--fg-muted)', fontSize: '0.85rem' }}>
                          No photos added yet. Select files or paste URLs above.
                        </div>
                      ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
                          {stagedPhotos.map((item, pIdx) => {
                            const isCover = pIdx === 0;
                            const isPending = !!item.file;

                            return (
                              <div
                                key={item.id}
                                style={{
                                  position: 'relative',
                                  borderRadius: '12px',
                                  overflow: 'hidden',
                                  border: isCover ? '2px solid var(--accent)' : '1px solid var(--border)',
                                  backgroundColor: 'var(--bg-surface)',
                                  display: 'flex',
                                  flexDirection: 'column',
                                }}
                              >
                                {/* Photo Container */}
                                <div style={{ position: 'relative', height: '120px', width: '100%', backgroundColor: 'var(--bg-elevated)' }}>
                                  <img
                                    src={item.url}
                                    alt={`Photo ${pIdx + 1}`}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  />
                                  
                                  {/* Badge */}
                                  <div
                                    style={{
                                      position: 'absolute',
                                      top: '6px',
                                      left: '6px',
                                      padding: '0.15rem 0.45rem',
                                      borderRadius: '9999px',
                                      backgroundColor: isCover ? 'var(--accent)' : 'rgba(15, 23, 42, 0.85)',
                                      color: '#fff',
                                      fontSize: '0.65rem',
                                      fontWeight: 700,
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '0.25rem',
                                    }}
                                  >
                                    <span>{isCover ? '★ #1 Cover' : `#${pIdx + 1}`}</span>
                                    {isPending && <span style={{ opacity: 0.8, fontSize: '0.6rem' }}>(New)</span>}
                                  </div>

                                  {/* Delete Button */}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveImage(pIdx)}
                                    style={{
                                      position: 'absolute',
                                      top: '6px',
                                      right: '6px',
                                      width: '24px',
                                      height: '24px',
                                      borderRadius: '50%',
                                      backgroundColor: 'rgba(239, 68, 68, 0.9)',
                                      color: '#fff',
                                      border: 'none',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      cursor: 'pointer',
                                    }}
                                    title="Remove photo"
                                  >
                                    <X size={12} strokeWidth={2.5} />
                                  </button>
                                </div>

                                {/* Controls Bar */}
                                <div style={{ padding: '0.4rem 0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--bg-elevated)', borderTop: '1px solid var(--border)' }}>
                                  <div style={{ display: 'flex', gap: '0.2rem' }}>
                                    <button
                                      type="button"
                                      disabled={pIdx === 0}
                                      onClick={() => handleMoveImage(pIdx, 'left')}
                                      className="btn btn-outline"
                                      style={{ padding: '0.2rem 0.4rem', fontSize: '0.7rem', opacity: pIdx === 0 ? 0.3 : 1 }}
                                      title="Move Left"
                                    >
                                      <ArrowLeft size={11} />
                                    </button>
                                    <button
                                      type="button"
                                      disabled={pIdx === stagedPhotos.length - 1}
                                      onClick={() => handleMoveImage(pIdx, 'right')}
                                      className="btn btn-outline"
                                      style={{ padding: '0.2rem 0.4rem', fontSize: '0.7rem', opacity: pIdx === stagedPhotos.length - 1 ? 0.3 : 1 }}
                                      title="Move Right"
                                    >
                                      <ArrowRight size={11} />
                                    </button>
                                  </div>

                                  {!isCover && (
                                    <button
                                      type="button"
                                      onClick={() => handleSetCoverImage(pIdx)}
                                      style={{
                                        fontSize: '0.685rem',
                                        fontWeight: 600,
                                        color: 'var(--accent)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '0.2rem',
                                      }}
                                    >
                                      Set Cover
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                  </div>
                )}

                {/* ─── TAB 3: FIELD STORY & DETAILS PAGE ─── */}
                {activeTab === 'details' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    
                    {/* Full Story Headline Title */}
                    <div>
                      <label className="admin-label">Details Page Headline Title</label>
                      <input
                        {...registerAch('title')}
                        className="admin-input"
                        placeholder="e.g. Land Survey & Livestock Distribution in Rasulpur Char"
                      />
                      <span style={{ fontSize: '0.725rem', color: 'var(--fg-muted)' }}>
                        Displays as the large H1 title on the dedicated details page (`/achievements/[id]`).
                      </span>
                    </div>

                    {/* Location, Organization, Scope (3 Cards Metadata) */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
                      <div>
                        <label className="admin-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <MapPin size={13} className="text-[var(--accent)]" />
                          <span>Field Location</span>
                        </label>
                        <input
                          {...registerAch('location')}
                          className="admin-input"
                          placeholder="e.g. Rasulpur Char, Gaibandha District"
                        />
                      </div>

                      <div>
                        <label className="admin-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Building size={13} className="text-[var(--accent)]" />
                          <span>Organization / Partner</span>
                        </label>
                        <input
                          {...registerAch('organization')}
                          className="admin-input"
                          placeholder="e.g. Community Field Initiative"
                        />
                      </div>

                      <div>
                        <label className="admin-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Layers size={13} className="text-[var(--accent)]" />
                          <span>Scope & Execution</span>
                        </label>
                        <input
                          {...registerAch('scope')}
                          className="admin-input"
                          placeholder="e.g. Field Survey & Economic Aid"
                        />
                      </div>
                    </div>

                    {/* In-Depth Field Narrative / Full Story */}
                    <div>
                      <label className="admin-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Compass size={13} className="text-[var(--accent)]" />
                        <span>Field Overview & Context Narrative</span>
                      </label>
                      <textarea
                        {...registerAch('fullStory')}
                        className="admin-input"
                        rows={4}
                        style={{
                          height: 'auto',
                          minHeight: '110px',
                          padding: '0.75rem 0.95rem',
                          lineHeight: 1.6,
                        }}
                        placeholder="Provide the complete in-depth backstory, context, methodology, and direct community impact..."
                      />
                    </div>

                    {/* Key Measurable Outcomes (Bullet list manager) */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <label className="admin-label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <CheckCircle2 size={13} className="text-[var(--accent)]" />
                          <span>Key Measurable Outcomes & Takeaways ({currentKeyTakeaways.length})</span>
                        </label>
                      </div>

                      {/* Add Outcome Input */}
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <input
                          type="text"
                          value={newOutcomeText}
                          onChange={(e) => setNewOutcomeText(e.target.value)}
                          placeholder="Add a key outcome bullet (e.g. Procured and distributed livestock to 20 households)..."
                          className="admin-input"
                          style={{ flex: 1 }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddOutcome();
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleAddOutcome}
                          className="btn btn-outline"
                          style={{ padding: '0.55rem 0.95rem', fontSize: '0.8rem', borderRadius: '10px', whiteSpace: 'nowrap' }}
                        >
                          <Plus size={14} /> Add Bullet
                        </button>
                      </div>

                      {/* Outcomes List */}
                      {currentKeyTakeaways.length === 0 ? (
                        <p style={{ fontSize: '0.8rem', color: 'var(--fg-muted)', margin: 0, fontStyle: 'italic' }}>
                          No custom takeaways specified. Default category takeaways will be used.
                        </p>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {currentKeyTakeaways.map((outcome, oIdx) => (
                            <div
                              key={oIdx}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.45rem 0.65rem',
                                backgroundColor: 'var(--bg-elevated)',
                                borderRadius: '8px',
                                border: '1px solid var(--border)',
                              }}
                            >
                              <span
                                style={{
                                  width: '20px',
                                  height: '20px',
                                  borderRadius: '5px',
                                  backgroundColor: 'var(--accent-subtle)',
                                  color: 'var(--accent)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.7rem',
                                  fontWeight: 700,
                                  flexShrink: 0,
                                }}
                              >
                                {oIdx + 1}
                              </span>

                              <input
                                type="text"
                                value={outcome}
                                onChange={(e) => handleEditOutcome(oIdx, e.target.value)}
                                className="admin-input"
                                style={{ height: '32px', fontSize: '0.85rem', flex: 1, padding: '0.2rem 0.6rem' }}
                              />

                              <div style={{ display: 'flex', gap: '0.2rem', flexShrink: 0 }}>
                                <button
                                  type="button"
                                  disabled={oIdx === 0}
                                  onClick={() => handleMoveOutcome(oIdx, 'up')}
                                  className="btn btn-outline"
                                  style={{ padding: '0.2rem 0.35rem', opacity: oIdx === 0 ? 0.3 : 1 }}
                                  title="Move Up"
                                >
                                  ↑
                                </button>
                                <button
                                  type="button"
                                  disabled={oIdx === currentKeyTakeaways.length - 1}
                                  onClick={() => handleMoveOutcome(oIdx, 'down')}
                                  className="btn btn-outline"
                                  style={{ padding: '0.2rem 0.35rem', opacity: oIdx === currentKeyTakeaways.length - 1 ? 0.3 : 1 }}
                                  title="Move Down"
                                >
                                  ↓
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveOutcome(oIdx)}
                                  style={{
                                    padding: '0.2rem 0.35rem',
                                    color: '#ef4444',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                  }}
                                  title="Delete bullet"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                )}

                {/* ─── TAB 4: LIVE DETAILS PREVIEW ─── */}
                {activeTab === 'preview' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    
                    <div style={{ padding: '1rem', backgroundColor: 'var(--bg-elevated)', borderRadius: '14px', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--fg)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          Simulated Details Page Preview (`/achievements/[id]`)
                        </span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)', backgroundColor: 'var(--accent-subtle)', padding: '0.2rem 0.6rem', borderRadius: '9999px' }}>
                          Interactive Preview
                        </span>
                      </div>

                      {/* Simulated Details Header */}
                      <div style={{ marginBottom: '1.25rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)', backgroundColor: 'var(--accent-subtle)', border: '1px solid var(--accent-border)', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                          {currentCategory || 'Community Development'}
                        </span>
                        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--fg)', margin: '0.5rem 0 0.25rem', lineHeight: 1.25 }}>
                          {currentTitle || currentHighlight || 'Milestone Story Title'}
                        </h2>
                        <p style={{ fontSize: '0.95rem', color: 'var(--accent)', fontWeight: 600, margin: 0 }}>
                          {currentHighlight || 'Key Highlight Stat'}
                        </p>
                      </div>

                      {/* Simulated Photo Carousel */}
                      <div style={{ position: 'relative', height: '220px', width: '100%', borderRadius: '12px', overflow: 'hidden', backgroundColor: 'var(--bg-surface)', marginBottom: '1.25rem', border: '1px solid var(--border)' }}>
                        <img
                          src={stagedPhotos[previewCarouselIdx]?.url || 'https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=800&auto=format&fit=crop'}
                          alt="Preview"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{ position: 'absolute', bottom: '10px', left: '10px', padding: '0.25rem 0.65rem', borderRadius: '9999px', backgroundColor: 'rgba(15, 23, 42, 0.8)', color: '#fff', fontSize: '0.75rem', fontWeight: 600 }}>
                          Photo {previewCarouselIdx + 1} of {Math.max(1, stagedPhotos.length)}
                        </div>

                        {stagedPhotos.length > 1 && (
                          <div style={{ position: 'absolute', bottom: '10px', right: '10px', display: 'flex', gap: '0.35rem' }}>
                            <button
                              type="button"
                              onClick={() => setPreviewCarouselIdx((prev) => (prev - 1 + stagedPhotos.length) % stagedPhotos.length)}
                              style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(15, 23, 42, 0.8)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              <ChevronLeft size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setPreviewCarouselIdx((prev) => (prev + 1) % stagedPhotos.length)}
                              style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(15, 23, 42, 0.8)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              <ChevronRight size={14} />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Simulated 3 Metadata Cards */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
                        <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-surface)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                          <div style={{ fontSize: '0.65rem', color: 'var(--fg-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Location</div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--fg)' }}>{currentLocation || 'Gaibandha, Bangladesh'}</div>
                        </div>
                        <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-surface)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                          <div style={{ fontSize: '0.65rem', color: 'var(--fg-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Organization</div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--fg)' }}>{currentOrganization || 'Community Field Initiative'}</div>
                        </div>
                        <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-surface)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                          <div style={{ fontSize: '0.65rem', color: 'var(--fg-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Scope</div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--fg)' }}>{currentScope || 'Field Survey & Aid'}</div>
                        </div>
                      </div>

                      {/* Simulated Narrative */}
                      <div style={{ padding: '1rem', backgroundColor: 'var(--bg-surface)', borderRadius: '10px', border: '1px solid var(--border)', marginBottom: '1rem' }}>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--fg)', marginBottom: '0.5rem' }}>
                          Field Overview & Context
                        </h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--fg-muted)', lineHeight: 1.6, margin: 0 }}>
                          {currentFullStory || currentDesc || 'Field overview and context narrative...'}
                        </p>
                      </div>

                      {/* Simulated Outcomes */}
                      <div style={{ padding: '1rem', backgroundColor: 'var(--bg-surface)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--fg)', marginBottom: '0.5rem' }}>
                          Key Measurable Outcomes
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          {(currentKeyTakeaways.length > 0 ? currentKeyTakeaways : ['Executed baseline demographic surveys', 'Coordinated household aid distribution']).map((item, i) => (
                            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.825rem', color: 'var(--fg-muted)' }}>
                              <Check size={12} className="text-emerald-500" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                    </div>

                  </div>
                )}

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
                disabled={!isAchDirty || isAchSubmitting || saveAchMutation.isPending || isUploadingOnSave}
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
                {isAchSubmitting || saveAchMutation.isPending || isUploadingOnSave ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>{uploadStatusText || 'Saving Achievement & Story...'}</span>
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    <span>Save Achievement & Story</span>
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
              <DrawerTitle>Customize Achievements Header</DrawerTitle>
              <DrawerDescription>
                Customize badge label, headline title, and descriptive subtitle shown at the top of the Key Achievements section.
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
                  <label className="admin-label">Section Description</label>
                  <textarea
                    {...registerHeader('description')}
                    className="admin-input"
                    rows={3}
                    style={{ height: 'auto', minHeight: '85px', padding: '0.75rem 0.95rem', lineHeight: 1.55 }}
                    placeholder="Quantifiable leadership results, community development initiatives..."
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
                    <span>Saving...</span>
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

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1rem',
          }}
        >
          <div
            className="card bezel-card"
            style={{
              maxWidth: '400px',
              width: '100%',
              padding: '1.75rem',
              backgroundColor: 'var(--bg-surface)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#ef4444' }}>
              <AlertTriangle size={24} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--fg)', margin: 0 }}>
                Delete Achievement?
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--fg-muted)', margin: 0, lineHeight: 1.5 }}>
              Are you sure you want to permanently delete this achievement milestone and its field story? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="btn btn-outline"
                style={{ padding: '0.45rem 1rem', fontSize: '0.85rem', borderRadius: '8px' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => deleteAchMutation.mutate(deleteId)}
                disabled={deleteAchMutation.isPending}
                className="btn btn-primary"
                style={{
                  backgroundColor: '#ef4444',
                  borderColor: '#ef4444',
                  padding: '0.45rem 1.15rem',
                  fontSize: '0.85rem',
                  borderRadius: '8px',
                }}
              >
                {deleteAchMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
