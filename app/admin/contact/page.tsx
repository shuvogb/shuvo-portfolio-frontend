'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Mail,
  Phone,
  MapPin,
  Save,
  Loader2,
  SlidersHorizontal,
  MessageSquare,
  ArrowUpRight,
  Inbox,
  Calendar,
  FileText,
  Users,
} from 'lucide-react';
import Link from 'next/link';
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

const contactConfigSchema = z.object({
  badge: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  collabTitle: z.string().optional(),
  collabDescription: z.string().optional(),
  email: z.string().email('Valid email address is required').optional().or(z.literal('')),
  phone: z.string().optional(),
  presentAddress: z.string().optional(),
});

type ContactConfigFormValues = z.infer<typeof contactConfigSchema>;

export default function AdminContactPage() {
  const qc = useQueryClient();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Fetch current profile
  const { data: profile, isLoading: isProfileLoading } = useQuery<Profile>({
    queryKey: ['admin-profile'],
    queryFn: async () => {
      const res = await api.get('/admin/profile');
      return res.data.data;
    },
  });

  // Fetch recent messages count
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: messages = [] } = useQuery<any[]>({
    queryKey: ['admin-messages'],
    queryFn: async () => {
      const res = await api.get('/admin/messages');
      return res.data.data;
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ContactConfigFormValues>({
    resolver: zodResolver(contactConfigSchema),
    defaultValues: {
      badge: 'Direct Connection',
      title: 'Get in Touch',
      description:
        'Open to academic research collaborations, fieldwork consultations, and community initiatives. Send a note below.',
      collabTitle: "Let's Discuss Collaborations & Research",
      collabDescription:
        'Feel free to reach out directly via email, phone, or by submitting this message form. I typically respond within 24–48 hours.',
      email: 'shuvomolla7374@gmail.com',
      phone: '+880 1607-065888',
      presentAddress: 'Ashulia, Savar, Dhaka, Bangladesh',
    },
  });

  const openDrawer = () => {
    reset({
      badge: profile?.contactSection?.badge || 'Direct Connection',
      title: profile?.contactSection?.title || 'Get in Touch',
      description:
        profile?.contactSection?.description ||
        'Open to academic research collaborations, fieldwork consultations, and community initiatives. Send a note below.',
      collabTitle: profile?.contactSection?.collabTitle || "Let's Discuss Collaborations & Research",
      collabDescription:
        profile?.contactSection?.collabDescription ||
        'Feel free to reach out directly via email, phone, or by submitting this message form. I typically respond within 24–48 hours.',
      email: profile?.email || 'shuvomolla7374@gmail.com',
      phone: profile?.phone || '+880 1607-065888',
      presentAddress: profile?.presentAddress || 'Ashulia, Savar, Dhaka, Bangladesh',
    });
    setDrawerOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: async (data: ContactConfigFormValues) => {
      return api.put('/admin/profile', {
        ...profile,
        email: data.email,
        phone: data.phone,
        presentAddress: data.presentAddress,
        contactSection: {
          badge: data.badge,
          title: data.title,
          description: data.description,
          collabTitle: data.collabTitle,
          collabDescription: data.collabDescription,
        },
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-profile'] });
      qc.invalidateQueries({ queryKey: ['portfolio'] });
      toast.success('Contact Section & Direct Info updated successfully!');
      setDrawerOpen(false);
    },
    onError: () => {
      toast.error('Failed to update contact settings.');
    },
  });

  const onSubmit = async (data: ContactConfigFormValues) => {
    await saveMutation.mutateAsync(data);
  };

  const currentBadge = watch('badge') || profile?.contactSection?.badge || 'Direct Connection';
  const currentTitle = watch('title') || profile?.contactSection?.title || 'Get in Touch';
  const currentDesc =
    watch('description') ||
    profile?.contactSection?.description ||
    'Open to academic research collaborations, fieldwork consultations, and community initiatives. Send a note below.';
  const currentCollabTitle =
    watch('collabTitle') || profile?.contactSection?.collabTitle || "Let's Discuss Collaborations & Research";
  const currentCollabDesc =
    watch('collabDescription') ||
    profile?.contactSection?.collabDescription ||
    'Feel free to reach out directly via email, phone, or by submitting this message form. I typically respond within 24–48 hours.';
  const currentEmail = watch('email') || profile?.email || 'shuvomolla7374@gmail.com';
  const currentPhone = watch('phone') || profile?.phone || '+880 1607-065888';
  const currentLocation = watch('presentAddress') || profile?.presentAddress || 'Ashulia, Savar, Dhaka, Bangladesh';

  const unreadMessages = messages.filter((m) => !m.isRead).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--fg)', letterSpacing: '-0.03em', marginBottom: '0.35rem' }}>
            Contact & Inquiries Configuration
          </h1>
          <p style={{ color: 'var(--fg-muted)', fontSize: '0.9rem', margin: 0 }}>
            Manage section copy, collaboration invitation text, direct communication channels, and message inbox.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link
            href="/admin/messages"
            className="btn btn-outline"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.6rem 1.15rem',
              borderRadius: '10px',
              fontWeight: 650,
              fontSize: '0.85rem',
              textDecoration: 'none',
            }}
          >
            <Inbox size={15} />
            <span>View Inbox ({messages.length})</span>
            {unreadMessages > 0 && (
              <span style={{ fontSize: '0.65rem', backgroundColor: 'var(--accent)', color: '#fff', padding: '0.1rem 0.4rem', borderRadius: '9999px', fontWeight: 700 }}>
                {unreadMessages} new
              </span>
            )}
          </Link>

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
            <span>Customize Contact Info</span>
          </button>
        </div>
      </div>

      {/* Live Section Header & Details Preview Card */}
      {isProfileLoading ? (
        <div className="skeleton" style={{ height: '300px', borderRadius: '16px' }} />
      ) : (
        <div className="card bezel-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.85rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--fg)', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <MessageSquare size={16} style={{ color: 'var(--accent)' }} />
              <span>Live Contact Section Preview</span>
            </span>
            <button
              onClick={openDrawer}
              className="btn btn-outline"
              style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem', borderRadius: '8px' }}
            >
              Edit Section Details
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            
            {/* Left: Header and Copy */}
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)', backgroundColor: 'var(--accent-subtle)', border: '1px solid var(--accent-border)', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                {currentBadge}
              </span>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--fg)', margin: '0.6rem 0 0.35rem', letterSpacing: '-0.02em' }}>
                {currentTitle}
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--fg-muted)', margin: '0 0 1.25rem', lineHeight: 1.55 }}>
                {currentDesc}
              </p>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--fg)', margin: '0 0 0.25rem' }}>
                {currentCollabTitle}
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--fg-muted)', margin: 0, lineHeight: 1.55 }}>
                {currentCollabDesc}
              </p>
            </div>

            {/* Right: Direct Channels Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1rem', backgroundColor: 'var(--bg-elevated)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '8px', backgroundColor: 'var(--accent-subtle)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Mail size={15} />
                </div>
                <div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--fg-muted)', fontWeight: 600, margin: 0 }}>EMAIL ADDRESS</p>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--fg)', margin: 0 }}>{currentEmail}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1rem', backgroundColor: 'var(--bg-elevated)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '8px', backgroundColor: 'var(--bg-surface)', color: 'var(--fg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid var(--border)' }}>
                  <Phone size={15} />
                </div>
                <div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--fg-muted)', fontWeight: 600, margin: 0 }}>PHONE / WHATSAPP</p>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--fg)', margin: 0 }}>{currentPhone}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1rem', backgroundColor: 'var(--bg-elevated)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '8px', backgroundColor: 'var(--bg-surface)', color: 'var(--fg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid var(--border)' }}>
                  <MapPin size={15} />
                </div>
                <div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--fg-muted)', fontWeight: 600, margin: 0 }}>PRIMARY LOCATION</p>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--fg)', margin: 0 }}>{currentLocation}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ─── Drawer: Contact Customization Drawer ───────────────────────── */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent width="max-w-2xl">
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            
            <DrawerHeader>
              <DrawerTitle>Customize Contact Section & Channels</DrawerTitle>
              <DrawerDescription>
                Configure section badge, header copy, collaboration invitation text, direct email, phone, and present location.
              </DrawerDescription>
            </DrawerHeader>

            <DrawerBody>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
                
                {/* Header Copy */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label className="admin-label">Section Badge</label>
                    <input
                      {...register('badge')}
                      className="admin-input"
                      placeholder="Direct Connection"
                    />
                  </div>

                  <div>
                    <label className="admin-label">Section Main Title</label>
                    <input
                      {...register('title')}
                      className="admin-input"
                      placeholder="Get in Touch"
                    />
                  </div>
                </div>

                <div>
                  <label className="admin-label">Section Subtitle / Description</label>
                  <textarea
                    {...register('description')}
                    className="admin-input"
                    rows={2}
                    style={{ height: 'auto', minHeight: '65px', padding: '0.65rem 0.85rem' }}
                    placeholder="Open to academic research collaborations, fieldwork consultations, and community initiatives. Send a note below."
                  />
                </div>

                {/* Collaboration Block */}
                <div>
                  <label className="admin-label">Collaboration Column Heading</label>
                  <input
                    {...register('collabTitle')}
                    className="admin-input"
                    placeholder="Let's Discuss Collaborations & Research"
                  />
                </div>

                <div>
                  <label className="admin-label">Collaboration Column Description</label>
                  <textarea
                    {...register('collabDescription')}
                    className="admin-input"
                    rows={2}
                    style={{ height: 'auto', minHeight: '65px', padding: '0.65rem 0.85rem' }}
                    placeholder="Feel free to reach out directly via email, phone, or by submitting this message form. I typically respond within 24–48 hours."
                  />
                </div>

                {/* Direct Contact Info */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label className="admin-label">Direct Email Address</label>
                    <input
                      {...register('email')}
                      className="admin-input"
                      placeholder="shuvomolla7374@gmail.com"
                    />
                    {errors.email && (
                      <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: '0.2rem 0 0' }}>
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="admin-label">Phone / WhatsApp</label>
                    <input
                      {...register('phone')}
                      className="admin-input"
                      placeholder="+880 1607-065888"
                    />
                  </div>
                </div>

                <div>
                  <label className="admin-label">Primary Present Location</label>
                  <input
                    {...register('presentAddress')}
                    className="admin-input"
                    placeholder="Ashulia, Savar, Dhaka, Bangladesh"
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
                    <span>Save Contact Config</span>
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
