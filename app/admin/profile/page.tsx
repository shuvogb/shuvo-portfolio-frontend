'use client';

import { useEffect, useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Save,
  Loader2,
  Upload,
  SlidersHorizontal,
  ArrowUpRight,
  BookOpen,
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

const heroStatItemSchema = z.object({
  value: z.string().min(1, 'Value is required'),
  label: z.string().min(1, 'Label is required'),
  sublabel: z.string().min(1, 'Sublabel is required'),
});

const actionCtaSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  link: z.string().min(1, 'Link is required'),
});

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  headline: z.string().min(1, 'Headline is required'),
  summary: z.string().min(10, 'Summary must be at least 10 chars'),
  statusBadge: z.string().optional(),
  avatarUrl: z.string().optional(),
  heroStats: z
    .object({
      events: heroStatItemSchema.optional(),
      papers: heroStatItemSchema.optional(),
      reach: heroStatItemSchema.optional(),
    })
    .optional(),
  primaryCta: actionCtaSchema.optional(),
  secondaryCta: actionCtaSchema.optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

function SectionBadgeNumber({ num, title }: { num: string; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.15rem' }}>
      <span
        style={{
          width: '24px',
          height: '24px',
          borderRadius: '7px',
          backgroundColor: 'var(--accent-subtle)',
          color: 'var(--accent)',
          border: '1px solid var(--accent-border)',
          fontSize: '0.725rem',
          fontWeight: 750,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {num}
      </span>
      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--fg)', letterSpacing: '-0.01em' }}>
        {title}
      </span>
    </div>
  );
}

export default function AdminProfilePage() {
  const qc = useQueryClient();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewAvatarUrl, setPreviewAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile, isLoading } = useQuery<any>({
    queryKey: ['admin-profile'],
    queryFn: async () => {
      const res = await api.get('/admin/profile');
      return res.data.data;
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      statusBadge: 'Open for Research & Community Initiatives',
      heroStats: {
        events: { value: '20+', label: 'Events Organized', sublabel: 'Youth & Academic' },
        papers: { value: '2', label: 'Academic Papers', sublabel: 'Published / Review' },
        reach: { value: '100+', label: 'Fieldwork Reach', sublabel: 'Char Communities' },
      },
      primaryCta: { label: 'Get in Touch', link: '#contact' },
      secondaryCta: { label: 'Publications', link: '#publications' },
    },
  });

  const summaryValue = watch('summary');

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(textareaRef.current.scrollHeight, 100)}px`;
    }
  }, [summaryValue, drawerOpen]);

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name,
        headline: profile.headline,
        summary: profile.summary,
        statusBadge: profile.statusBadge || 'Open for Research & Community Initiatives',
        avatarUrl: profile.avatarUrl,
        heroStats: {
          events: profile.heroStats?.events || { value: '20+', label: 'Events Organized', sublabel: 'Youth & Academic' },
          papers: profile.heroStats?.papers || { value: '2', label: 'Academic Papers', sublabel: 'Published / Review' },
          reach: profile.heroStats?.reach || { value: '100+', label: 'Fieldwork Reach', sublabel: 'Char Communities' },
        },
        primaryCta: profile.primaryCta || { label: 'Get in Touch', link: '#contact' },
        secondaryCta: profile.secondaryCta || { label: 'Publications', link: '#publications' },
      });
      setAvatarFile(null);
      setPreviewAvatarUrl(null);
    }
  }, [profile, reset]);

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);
    const localUrl = URL.createObjectURL(file);
    setPreviewAvatarUrl(localUrl);
    setValue('avatarUrl', localUrl, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  };

  const saveMutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      return api.put('/admin/profile', {
        ...profile,
        ...data,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-profile'] });
      qc.invalidateQueries({ queryKey: ['portfolio'] });
      toast.success('Hero Section & Profile updated successfully!');
      setAvatarFile(null);
      setPreviewAvatarUrl(null);
      setDrawerOpen(false);
    },
    onError: () => {
      toast.error('Failed to update profile. Check form fields.');
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    let finalAvatarUrl = data.avatarUrl;

    if (avatarFile) {
      try {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', avatarFile);
        formData.append('altText', 'Profile portrait photo');

        const res = await api.post('/admin/media/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        finalAvatarUrl = res.data.data.url;
      } catch {
        toast.error('Failed to upload image to Cloudinary. Please try again.');
        setUploading(false);
        return;
      } finally {
        setUploading(false);
      }
    }

    await saveMutation.mutateAsync({
      ...data,
      avatarUrl: finalAvatarUrl,
    });
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="skeleton" style={{ height: '40px', width: '260px' }} />
        <div className="skeleton" style={{ height: '360px' }} />
      </div>
    );
  }

  const currentAvatar = previewAvatarUrl || watch('avatarUrl') || profile?.avatarUrl || '/images/shuvo.png';
  const currentStatus = watch('statusBadge') || profile?.statusBadge || 'Open for Research & Community Initiatives';
  const currentName = watch('name') || profile?.name || 'Shuvo Molla';
  const currentHeadline = watch('headline') || profile?.headline || 'Sociology & Social Work Undergraduate';
  const currentSummary = watch('summary') || profile?.summary || '';
  const currentEvents = watch('heroStats.events') || profile?.heroStats?.events;
  const currentPapers = watch('heroStats.papers') || profile?.heroStats?.papers;
  const currentReach = watch('heroStats.reach') || profile?.heroStats?.reach;
  const currentPrimaryCta = watch('primaryCta') || profile?.primaryCta;
  const currentSecondaryCta = watch('secondaryCta') || profile?.secondaryCta;

  const { ref: summaryFormRef, ...restSummary } = register('summary');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Top Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--fg)', letterSpacing: '-0.03em', marginBottom: '0.35rem' }}>
            Hero & Identity
          </h1>
          <p style={{ color: 'var(--fg-muted)', fontSize: '0.9rem', margin: 0 }}>
            Manage the hero banner, headline, thesis statement, portrait photo, and floating stat badges.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="btn btn-primary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.6rem 1.35rem',
            borderRadius: '10px',
            fontWeight: 650,
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}
        >
          <SlidersHorizontal size={15} />
          <span>Customize</span>
        </button>
      </div>

      {/* Hero Live Visual Preview Card */}
      <div className="card bezel-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--fg)' }}>
              Live Hero Section Configuration
            </h2>
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)', backgroundColor: 'var(--accent-subtle)', padding: '0.3rem 0.75rem', borderRadius: '9999px', border: '1px solid var(--accent-border)' }}>
            Editable via Slide-Over Drawer
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
          
          {/* Left: Live Text Preview */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', padding: '0.35rem 0.85rem', backgroundColor: 'var(--accent-subtle)', border: '1px solid var(--accent-border)', borderRadius: '9999px', width: 'fit-content' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)' }}>{currentStatus}</span>
            </div>

            <h3 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--fg)', letterSpacing: '-0.03em', margin: 0 }}>
              {currentName}
            </h3>

            <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent)', margin: 0 }}>
              {currentHeadline}
            </p>

            <p style={{ fontSize: '0.875rem', color: 'var(--fg-muted)', lineHeight: 1.6, margin: 0 }}>
              {currentSummary}
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.5rem 1rem', borderRadius: '9999px', backgroundColor: 'var(--fg)', color: 'var(--bg)', fontSize: '0.8rem', fontWeight: 600 }}>
                <span>{currentPrimaryCta?.label || 'Get in Touch'}</span>
                <ArrowUpRight size={13} />
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.5rem 1rem', borderRadius: '9999px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-elevated)', color: 'var(--fg)', fontSize: '0.8rem', fontWeight: 600 }}>
                <span>{currentSecondaryCta?.label || 'Publications'}</span>
                <BookOpen size={13} />
              </div>
            </div>
          </div>

          {/* Right: Floating Stat Badges Preview */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: 'var(--bg-elevated)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img
                src={currentAvatar}
                alt="Portrait"
                style={{ width: '64px', height: '64px', borderRadius: '14px', objectFit: 'cover', border: '2px solid var(--accent)' }}
              />
              <div>
                <p style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0, color: 'var(--fg)' }}>Portrait Thumbnail</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--fg-muted)', margin: '0.15rem 0 0' }}>Rendered in 3D tilt card</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginTop: '0.5rem' }}>
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-surface)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                <p style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--fg)', margin: 0 }}>{currentEvents?.value || '20+'}</p>
                <p style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--fg)', margin: '0.1rem 0 0' }}>{currentEvents?.label || 'Events'}</p>
                <p style={{ fontSize: '0.65rem', color: 'var(--fg-muted)', margin: 0 }}>{currentEvents?.sublabel || 'Youth'}</p>
              </div>

              <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-surface)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                <p style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--fg)', margin: 0 }}>{currentPapers?.value || '2'}</p>
                <p style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--fg)', margin: '0.1rem 0 0' }}>{currentPapers?.label || 'Papers'}</p>
                <p style={{ fontSize: '0.65rem', color: 'var(--fg-muted)', margin: 0 }}>{currentPapers?.sublabel || 'Academic'}</p>
              </div>

              <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-surface)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                <p style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--fg)', margin: 0 }}>{currentReach?.value || '100+'}</p>
                <p style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--fg)', margin: '0.1rem 0 0' }}>{currentReach?.label || 'Reach'}</p>
                <p style={{ fontSize: '0.65rem', color: 'var(--fg-muted)', margin: 0 }}>{currentReach?.sublabel || 'Char'}</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ─── Custom Slide-Over Edit Drawer ─────────────────────────────────── */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent width="max-w-3xl">
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            
            <DrawerHeader>
              <DrawerTitle>Customize Hero Section & Profile</DrawerTitle>
              <DrawerDescription>
                Make live adjustments to your hero headline, portrait photo, 3-side floating stats, and CTAs.
              </DrawerDescription>
            </DrawerHeader>

            <DrawerBody>
              
              {/* SECTION 1: Status & Core Thesis */}
              <div style={{ padding: '1.4rem 1.6rem', backgroundColor: 'var(--bg-elevated)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <SectionBadgeNumber num="01" title="Hero Status & Primary Headline" />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <label className="admin-label">Status Badge Text</label>
                    <input
                      {...register('statusBadge')}
                      className="admin-input"
                      placeholder="e.g. Open for Research & Community Initiatives"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label className="admin-label">Full Name *</label>
                      <input
                        {...register('name')}
                        className="admin-input"
                        placeholder="Shuvo Molla"
                      />
                      {errors.name && <span className="text-xs text-red-500 mt-1 block">{errors.name.message}</span>}
                    </div>

                    <div>
                      <label className="admin-label">Professional Headline *</label>
                      <input
                        {...register('headline')}
                        className="admin-input"
                        placeholder="Sociology & Social Work Undergraduate..."
                      />
                      {errors.headline && <span className="text-xs text-red-500 mt-1 block">{errors.headline.message}</span>}
                    </div>
                  </div>

                  <div>
                    <label className="admin-label">Hero Bio / Abstract *</label>
                    <textarea
                      {...restSummary}
                      ref={(el) => {
                        summaryFormRef(el);
                        textareaRef.current = el;
                      }}
                      onInput={(e) => {
                        const target = e.currentTarget;
                        target.style.height = 'auto';
                        target.style.height = `${Math.max(target.scrollHeight, 100)}px`;
                      }}
                      className="admin-input"
                      style={{
                        height: 'auto',
                        minHeight: '100px',
                        overflow: 'hidden',
                        resize: 'none',
                        padding: '0.75rem 0.95rem',
                        lineHeight: 1.65,
                      }}
                      placeholder="Sociology & Social Work researcher specializing in quantitative methods..."
                    />
                    {errors.summary && <span className="text-xs text-red-500 mt-1 block">{errors.summary.message}</span>}
                  </div>
                </div>
              </div>

              {/* SECTION 2: Portrait & Media */}
              <div style={{ padding: '1.4rem 1.6rem', backgroundColor: 'var(--bg-elevated)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <SectionBadgeNumber num="02" title="Hero Portrait Photo" />

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                  <img
                    src={currentAvatar}
                    alt="Preview"
                    style={{ width: '80px', height: '80px', borderRadius: '18px', objectFit: 'cover', border: '2px solid var(--border)' }}
                  />

                  <div style={{ flex: 1, minWidth: '240px', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <input
                      {...register('avatarUrl')}
                      className="admin-input"
                      placeholder="https://... or /images/shuvo.png"
                    />
                    <label
                      className="btn btn-outline"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        padding: '0.45rem 1rem',
                        fontSize: '0.8rem',
                        width: 'fit-content',
                        cursor: 'pointer',
                      }}
                    >
                      <Upload size={14} />
                      <span>{avatarFile ? `Selected: ${avatarFile.name}` : 'Upload New Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarSelect}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* SECTION 3: 3-Side Floating Stats */}
              <div style={{ padding: '1.4rem 1.6rem', backgroundColor: 'var(--bg-elevated)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <SectionBadgeNumber num="03" title="Hero Floating Highlight Stat Badges" />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Stat 1: Events */}
                  <div style={{ padding: '0.85rem 1rem', backgroundColor: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--fg)', marginBottom: '0.5rem' }}>
                      Left Badge: Events / Initiatives
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.65rem' }}>
                      <div>
                        <label className="text-[0.7rem] font-semibold text-[var(--fg-muted)] mb-1 block">Value</label>
                        <input {...register('heroStats.events.value')} className="admin-input" placeholder="20+" />
                      </div>
                      <div>
                        <label className="text-[0.7rem] font-semibold text-[var(--fg-muted)] mb-1 block">Label</label>
                        <input {...register('heroStats.events.label')} className="admin-input" placeholder="Events Organized" />
                      </div>
                      <div>
                        <label className="text-[0.7rem] font-semibold text-[var(--fg-muted)] mb-1 block">Sublabel</label>
                        <input {...register('heroStats.events.sublabel')} className="admin-input" placeholder="Youth & Academic" />
                      </div>
                    </div>
                  </div>

                  {/* Stat 2: Papers */}
                  <div style={{ padding: '0.85rem 1rem', backgroundColor: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--fg)', marginBottom: '0.5rem' }}>
                      Right Badge: Academic Papers
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.65rem' }}>
                      <div>
                        <label className="text-[0.7rem] font-semibold text-[var(--fg-muted)] mb-1 block">Value</label>
                        <input {...register('heroStats.papers.value')} className="admin-input" placeholder="2" />
                      </div>
                      <div>
                        <label className="text-[0.7rem] font-semibold text-[var(--fg-muted)] mb-1 block">Label</label>
                        <input {...register('heroStats.papers.label')} className="admin-input" placeholder="Academic Papers" />
                      </div>
                      <div>
                        <label className="text-[0.7rem] font-semibold text-[var(--fg-muted)] mb-1 block">Sublabel</label>
                        <input {...register('heroStats.papers.sublabel')} className="admin-input" placeholder="Published / Review" />
                      </div>
                    </div>
                  </div>

                  {/* Stat 3: Fieldwork Reach */}
                  <div style={{ padding: '0.85rem 1rem', backgroundColor: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--fg)', marginBottom: '0.5rem' }}>
                      Bottom Badge: Fieldwork Reach
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.65rem' }}>
                      <div>
                        <label className="text-[0.7rem] font-semibold text-[var(--fg-muted)] mb-1 block">Value</label>
                        <input {...register('heroStats.reach.value')} className="admin-input" placeholder="100+" />
                      </div>
                      <div>
                        <label className="text-[0.7rem] font-semibold text-[var(--fg-muted)] mb-1 block">Label</label>
                        <input {...register('heroStats.reach.label')} className="admin-input" placeholder="Fieldwork Reach" />
                      </div>
                      <div>
                        <label className="text-[0.7rem] font-semibold text-[var(--fg-muted)] mb-1 block">Sublabel</label>
                        <input {...register('heroStats.reach.sublabel')} className="admin-input" placeholder="Char Communities" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 4: Action CTA Buttons */}
              <div style={{ padding: '1.4rem 1.6rem', backgroundColor: 'var(--bg-elevated)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <SectionBadgeNumber num="04" title="Action CTA Buttons" />

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                  <div>
                    <label className="admin-label">Primary Button Label</label>
                    <input {...register('primaryCta.label')} className="admin-input" placeholder="Get in Touch" />
                  </div>
                  <div>
                    <label className="admin-label">Primary Button Link / Anchor</label>
                    <input {...register('primaryCta.link')} className="admin-input" placeholder="#contact" />
                  </div>
                  <div>
                    <label className="admin-label">Secondary Button Label</label>
                    <input {...register('secondaryCta.label')} className="admin-input" placeholder="Publications" />
                  </div>
                  <div>
                    <label className="admin-label">Secondary Button Link / Anchor</label>
                    <input {...register('secondaryCta.link')} className="admin-input" placeholder="#publications" />
                  </div>
                </div>
              </div>

            </DrawerBody>

            <DrawerFooter>
              <button
                type="button"
                onClick={() => {
                  setAvatarFile(null);
                  setPreviewAvatarUrl(null);
                  setDrawerOpen(false);
                }}
                className="btn btn-outline"
                style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem', borderRadius: '10px' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isDirty || isSubmitting || saveMutation.isPending || uploading}
                className="btn btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.55rem 1.5rem',
                  fontSize: '0.85rem',
                  borderRadius: '10px',
                  opacity: !isDirty ? 0.45 : 1,
                  cursor: !isDirty ? 'not-allowed' : 'pointer',
                  transition: 'opacity 0.15s ease',
                }}
              >
                {isSubmitting || saveMutation.isPending || uploading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>{uploading ? 'Uploading Photo...' : 'Saving Changes...'}</span>
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </DrawerFooter>

          </form>
        </DrawerContent>
      </Drawer>

    </div>
  );
}
