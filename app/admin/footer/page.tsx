'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Save,
  Loader2,
  SlidersHorizontal,
  MapPin,
  Mail,
  ArrowUp,
  LayoutTemplate,
} from 'lucide-react';
import { FiLinkedin, FiFacebook } from 'react-icons/fi';
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
import type { Profile } from '@/types/portfolio';

const footerConfigSchema = z.object({
  roleBadge: z.string().optional(),
  tagline: z.string().optional(),
  location: z.string().optional(),
  navTitle: z.string().optional(),
  channelsTitle: z.string().optional(),
  copyrightText: z.string().optional(),
});

type FooterConfigFormValues = z.infer<typeof footerConfigSchema>;

export default function AdminFooterPage() {
  const qc = useQueryClient();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  // Fetch current profile
  const { data: profile, isLoading: isProfileLoading } = useQuery<Profile>({
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
    formState: { isSubmitting, isDirty },
  } = useForm<FooterConfigFormValues>({
    resolver: zodResolver(footerConfigSchema),
    defaultValues: {
      roleBadge: 'Social Researcher',
      tagline:
        'Sociology & Social Work undergraduate focused on empirical data modeling, char community studies, and youth development.',
      location: 'Gono Bishwabidyalay · Savar, Dhaka',
      navTitle: 'PORTFOLIO NAVIGATION',
      channelsTitle: 'CONNECT & CHANNELS',
      copyrightText: '© {year} {name}. Built with Next.js & TypeScript.',
    },
  });

  const openDrawer = () => {
    reset({
      roleBadge: profile?.footerSection?.roleBadge || 'Social Researcher',
      tagline:
        profile?.footerSection?.tagline ||
        'Sociology & Social Work undergraduate focused on empirical data modeling, char community studies, and youth development.',
      location: profile?.footerSection?.location || 'Gono Bishwabidyalay · Savar, Dhaka',
      navTitle: profile?.footerSection?.navTitle || 'PORTFOLIO NAVIGATION',
      channelsTitle: profile?.footerSection?.channelsTitle || 'CONNECT & CHANNELS',
      copyrightText: profile?.footerSection?.copyrightText || '© {year} {name}. Built with Next.js & TypeScript.',
    });
    setDrawerOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: async (data: FooterConfigFormValues) => {
      return api.put('/admin/profile', {
        ...profile,
        footerSection: {
          roleBadge: data.roleBadge,
          tagline: data.tagline,
          location: data.location,
          navTitle: data.navTitle,
          channelsTitle: data.channelsTitle,
          copyrightText: data.copyrightText,
        },
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-profile'] });
      qc.invalidateQueries({ queryKey: ['portfolio'] });
      toast.success('Footer & Colophon configuration updated successfully!');
      setDrawerOpen(false);
    },
    onError: () => {
      toast.error('Failed to update footer settings.');
    },
  });

  const onSubmit = async (data: FooterConfigFormValues) => {
    await saveMutation.mutateAsync(data);
  };

  const name = profile?.name || 'Shuvo Molla';
  const currentRoleBadge = watch('roleBadge') || profile?.footerSection?.roleBadge || 'Social Researcher';
  const currentTagline =
    watch('tagline') ||
    profile?.footerSection?.tagline ||
    'Sociology & Social Work undergraduate focused on empirical data modeling, char community studies, and youth development.';
  const currentLocation = watch('location') || profile?.footerSection?.location || 'Gono Bishwabidyalay · Savar, Dhaka';
  const currentNavTitle = watch('navTitle') || profile?.footerSection?.navTitle || 'PORTFOLIO NAVIGATION';
  const currentChannelsTitle = watch('channelsTitle') || profile?.footerSection?.channelsTitle || 'CONNECT & CHANNELS';
  const rawCopyright =
    watch('copyrightText') ||
    profile?.footerSection?.copyrightText ||
    '© {year} {name}. Built with Next.js & TypeScript.';
  const previewCopyright = rawCopyright.replace('{year}', String(currentYear)).replace('{name}', name);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--fg)', letterSpacing: '-0.03em', marginBottom: '0.35rem' }}>
            Footer & Colophon Configuration
          </h1>
          <p style={{ color: 'var(--fg-muted)', fontSize: '0.9rem', margin: 0 }}>
            Customize identity tagline, academic affiliation badge, navigation column header, connect channels header, and copyright colophon text.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={openDrawer}
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
            <SlidersHorizontal size={15} />
            <span>Customize Footer</span>
          </button>
        </div>
      </div>

      {/* Live Footer Preview Card */}
      {isProfileLoading ? (
        <div className="skeleton" style={{ height: '240px', borderRadius: '16px' }} />
      ) : (
        <div className="card bezel-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.85rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--fg)', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <LayoutTemplate size={16} style={{ color: 'var(--accent)' }} />
              <span>Live Footer Section Preview</span>
            </span>
            <button
              onClick={openDrawer}
              className="btn btn-outline"
              style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem', borderRadius: '8px' }}
            >
              Edit Footer
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '2rem',
              paddingBottom: '1.5rem',
              borderBottom: '1px solid var(--border)',
            }}
          >
            {/* Left: Brand & Tagline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--fg)' }}>
                  {name}
                </span>
                {currentRoleBadge && (
                  <span style={{ fontSize: '0.65rem', fontWeight: 650, color: 'var(--accent)', backgroundColor: 'var(--accent-subtle)', border: '1px solid var(--accent-border)', padding: '0.1rem 0.45rem', borderRadius: '9999px' }}>
                    {currentRoleBadge}
                  </span>
                )}
              </div>

              <p style={{ fontSize: '0.825rem', color: 'var(--fg-muted)', margin: 0, lineHeight: 1.55 }}>
                {currentTagline}
              </p>

              {currentLocation && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--fg-muted)' }}>
                  <MapPin size={12} style={{ color: 'var(--accent)' }} />
                  <span>{currentLocation}</span>
                </div>
              )}
            </div>

            {/* Middle: Navigation */}
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--fg)', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 0.65rem' }}>
                {currentNavTitle}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.4rem 1rem', fontSize: '0.8rem', color: 'var(--fg-muted)' }}>
                <span>About</span>
                <span>Skills</span>
                <span>Experience</span>
                <span>Research</span>
                <span>Milestones</span>
                <span>Education</span>
                <span>Contact</span>
              </div>
            </div>

            {/* Right: Channels */}
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--fg)', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 0.65rem' }}>
                {currentChannelsTitle}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <FiLinkedin size={12} /> LinkedIn
                </span>
                <span className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <FiFacebook size={12} /> Facebook
                </span>
                <span className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Mail size={12} style={{ color: 'var(--accent)' }} /> Email
                </span>
              </div>
            </div>

          </div>

          {/* Bottom Preview */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <p style={{ fontSize: '0.775rem', color: 'var(--fg-muted)', margin: 0 }}>
              {previewCopyright}
            </p>
            <span className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <span>Back to Top</span>
              <ArrowUp size={12} />
            </span>
          </div>

        </div>
      )}

      {/* ─── Drawer: Footer Customization Drawer ───────────────────────── */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent width="max-w-xl">
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            
            <DrawerHeader>
              <DrawerTitle>Customize Footer & Colophon</DrawerTitle>
              <DrawerDescription>
                Configure role badge, tagline, affiliation text, navigation headers, and copyright colophon.
              </DrawerDescription>
            </DrawerHeader>

            <DrawerBody>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
                
                {/* Role Badge & Location */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label className="admin-label">Role / Status Badge</label>
                    <input
                      {...register('roleBadge')}
                      className="admin-input"
                      placeholder="Social Researcher"
                    />
                  </div>

                  <div>
                    <label className="admin-label">Affiliation / Location</label>
                    <input
                      {...register('location')}
                      className="admin-input"
                      placeholder="Gono Bishwabidyalay · Savar, Dhaka"
                    />
                  </div>
                </div>

                {/* Tagline */}
                <div>
                  <label className="admin-label">Footer Tagline / Brief Summary</label>
                  <textarea
                    {...register('tagline')}
                    className="admin-input"
                    rows={3}
                    style={{ height: 'auto', minHeight: '75px', padding: '0.65rem 0.85rem' }}
                    placeholder="Sociology & Social Work undergraduate focused on empirical data modeling, char community studies, and youth development."
                  />
                </div>

                {/* Column Titles */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label className="admin-label">Navigation Column Title</label>
                    <input
                      {...register('navTitle')}
                      className="admin-input"
                      placeholder="PORTFOLIO NAVIGATION"
                    />
                  </div>

                  <div>
                    <label className="admin-label">Channels Column Title</label>
                    <input
                      {...register('channelsTitle')}
                      className="admin-input"
                      placeholder="CONNECT & CHANNELS"
                    />
                  </div>
                </div>

                {/* Copyright / Colophon */}
                <div>
                  <label className="admin-label">
                    Copyright & Colophon Text (Supports <span className="mono" style={{ color: 'var(--accent)' }}>{'{year}'}</span> and <span className="mono" style={{ color: 'var(--accent)' }}>{'{name}'}</span>)
                  </label>
                  <input
                    {...register('copyrightText')}
                    className="admin-input"
                    placeholder="© {year} {name}. Built with Next.js & TypeScript."
                  />
                </div>

              </div>
            </DrawerBody>

            <DrawerFooter>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="btn btn-outline"
                style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem', borderRadius: '10px' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isDirty || isSubmitting || saveMutation.isPending}
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
                {isSubmitting || saveMutation.isPending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    <span>Save Footer Config</span>
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
