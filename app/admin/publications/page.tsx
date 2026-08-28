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
  FlaskConical,
  BookOpen,
  Calendar,
  ExternalLink,
  Users,
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
import { CustomSelect, CustomSelectOption } from '@/components/ui/custom-select';
import type { Publication } from '@/types/portfolio';

const STATUS_OPTIONS: CustomSelectOption[] = [
  {
    value: 'published',
    label: 'Published & Indexed',
    badge: 'Peer-Reviewed',
    icon: <BookOpen size={16} />,
  },
  {
    value: 'underReview',
    label: 'Manuscript Under Review',
    badge: 'In Review',
    icon: <FlaskConical size={16} />,
  },
  {
    value: 'researchAssistant',
    label: 'Research Assistant Work',
    badge: 'Fieldwork',
    icon: <Users size={16} />,
  },
];

const publicationItemSchema = z.object({
  title: z.string().min(1, 'Paper title is required'),
  authorsString: z.string().min(1, 'Authors (comma separated) are required'),
  source: z.string().min(1, 'Journal / Source venue is required'),
  year: z.number().min(1900).max(2100),
  volume: z.string().optional(),
  pages: z.string().optional(),
  link: z.string().url('Invalid URL format').optional().or(z.literal('')),
  status: z.enum(['published', 'underReview', 'researchAssistant']),
  description: z.string().optional(),
  order: z.number(),
});

const headerFormSchema = z.object({
  badge: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
});

type PublicationFormValues = z.infer<typeof publicationItemSchema>;
type HeaderFormValues = z.infer<typeof headerFormSchema>;

export default function AdminPublicationsPage() {
  const qc = useQueryClient();
  const [pubDrawerOpen, setPubDrawerOpen] = useState(false);
  const [headerDrawerOpen, setHeaderDrawerOpen] = useState(false);
  const [editPublication, setEditPublication] = useState<(Publication & { _id: string }) | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Fetch all publications
  const { data: publications = [], isLoading: isPubsLoading } = useQuery<(Publication & { _id: string })[]>({
    queryKey: ['admin-publications'],
    queryFn: async () => {
      const res = await api.get('/admin/publications');
      return res.data.data;
    },
  });

  // Fetch current profile for publicationsSection header configuration
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = useQuery<any>({
    queryKey: ['admin-profile'],
    queryFn: async () => {
      const res = await api.get('/admin/profile');
      return res.data.data;
    },
  });

  // Form for Publication Item
  const {
    register: registerPub,
    handleSubmit: handlePubSubmit,
    reset: resetPubForm,
    watch: watchPub,
    control: pubControl,
    formState: { errors: pubErrors, isSubmitting: isPubSubmitting, isDirty: isPubDirty },
  } = useForm<PublicationFormValues>({
    resolver: zodResolver(publicationItemSchema),
    defaultValues: {
      title: '',
      authorsString: 'Sourov, A., Shuvo, M.',
      source: '',
      year: new Date().getFullYear(),
      volume: '',
      pages: '',
      link: '',
      status: 'published',
      description: '',
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
      badge: 'Academic Scholarship & Papers',
      title: 'Research & Publications',
      description:
        'Peer-reviewed empirical studies and ongoing manuscripts addressing vulnerable communities, socio-economic dynamics, and char region livelihood deprivations.',
    },
  });

  const openCreatePub = () => {
    setEditPublication(null);
    resetPubForm({
      title: '',
      authorsString: 'Sourov, A., Shuvo, M.',
      source: '',
      year: new Date().getFullYear(),
      volume: '',
      pages: '',
      link: '',
      status: 'published',
      description: '',
      order: publications.length > 0 ? Math.max(...publications.map((p) => p.order || 0)) + 1 : 1,
    });
    setPubDrawerOpen(true);
  };

  const openEditPub = (pub: Publication & { _id: string }) => {
    setEditPublication(pub);
    resetPubForm({
      title: pub.title,
      authorsString: Array.isArray(pub.authors) ? pub.authors.join(', ') : pub.authors,
      source: pub.source,
      year: pub.year,
      volume: pub.volume || '',
      pages: pub.pages || '',
      link: pub.link || '',
      status: pub.status,
      description: pub.description || '',
      order: pub.order || 0,
    });
    setPubDrawerOpen(true);
  };

  const openHeaderDrawer = () => {
    resetHeaderForm({
      badge: profile?.publicationsSection?.badge || 'Academic Scholarship & Papers',
      title: profile?.publicationsSection?.title || 'Research & Publications',
      description:
        profile?.publicationsSection?.description ||
        'Peer-reviewed empirical studies and ongoing manuscripts addressing vulnerable communities, socio-economic dynamics, and char region livelihood deprivations.',
    });
    setHeaderDrawerOpen(true);
  };

  // Publication Create / Update Mutation
  const savePubMutation = useMutation({
    mutationFn: async (data: PublicationFormValues) => {
      const payload = {
        title: data.title,
        authors: data.authorsString.split(',').map((s) => s.trim()).filter(Boolean),
        source: data.source,
        year: data.year,
        volume: data.volume,
        pages: data.pages,
        link: data.link,
        status: data.status,
        description: data.description,
        order: data.order,
      };

      if (editPublication) {
        return api.put(`/admin/publications/${editPublication._id}`, payload);
      }
      return api.post('/admin/publications', payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-publications'] });
      qc.invalidateQueries({ queryKey: ['portfolio'] });
      toast.success(editPublication ? 'Publication updated successfully' : 'Publication added successfully');
      setPubDrawerOpen(false);
      setEditPublication(null);
    },
    onError: () => {
      toast.error('Operation failed. Please check form fields.');
    },
  });

  // Publication Delete Mutation
  const deletePubMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/admin/publications/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-publications'] });
      qc.invalidateQueries({ queryKey: ['portfolio'] });
      toast.success('Publication deleted successfully');
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
        publicationsSection: data,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-profile'] });
      qc.invalidateQueries({ queryKey: ['portfolio'] });
      toast.success('Publications Section Header updated successfully!');
      setHeaderDrawerOpen(false);
    },
    onError: () => {
      toast.error('Failed to update Section Header.');
    },
  });

  const onPubSubmit = async (data: PublicationFormValues) => {
    await savePubMutation.mutateAsync(data);
  };

  const onHeaderSubmit = async (data: HeaderFormValues) => {
    await saveHeaderMutation.mutateAsync(data);
  };

  const currentTitle = watchPub('title');
  const currentAuthors = watchPub('authorsString');
  const currentSource = watchPub('source');
  const currentYear = watchPub('year');
  const currentVolume = watchPub('volume');
  const currentPages = watchPub('pages');
  const currentStatus = watchPub('status');
  const currentLink = watchPub('link');

  const currentHeaderBadge = profile?.publicationsSection?.badge || 'Academic Scholarship & Papers';
  const currentHeaderTitle = profile?.publicationsSection?.title || 'Research & Publications';
  const currentHeaderDesc =
    profile?.publicationsSection?.description ||
    'Peer-reviewed empirical studies and ongoing manuscripts addressing vulnerable communities, socio-economic dynamics, and char region livelihood deprivations.';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--fg)', letterSpacing: '-0.03em', marginBottom: '0.35rem' }}>
            Research Publications
          </h1>
          <p style={{ color: 'var(--fg-muted)', fontSize: '0.9rem', margin: 0 }}>
            Manage peer-reviewed academic papers, manuscripts under review, journal citations, and section copy.
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
            onClick={openCreatePub}
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
            <span>Add Publication</span>
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

      {/* Publications List */}
      {isPubsLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '120px', borderRadius: '16px' }} />
          ))}
        </div>
      ) : publications.length === 0 ? (
        <div className="card bezel-card" style={{ textAlign: 'center', padding: '3.5rem 2rem', color: 'var(--fg-muted)' }}>
          <p style={{ marginBottom: '1.25rem', fontSize: '0.95rem' }}>No research publications configured yet.</p>
          <button onClick={openCreatePub} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', margin: '0 auto' }}>
            <Plus size={16} /> Add First Publication
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {publications.map((pub) => {
            const isPub = pub.status === 'published';

            return (
              <div
                key={pub._id}
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
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                    <span className={`badge ${isPub ? 'badge-primary' : ''}`} style={{ fontSize: '0.7rem' }}>
                      {isPub ? 'Published & Indexed' : pub.status === 'underReview' ? 'Under Review' : 'Research Assistant Work'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--fg-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Calendar size={11} style={{ color: 'var(--accent)' }} />
                      <span>{pub.year}</span>
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--fg)', margin: '0 0 0.35rem', lineHeight: 1.35 }}>
                    {pub.title}
                  </h3>

                  <p style={{ fontSize: '0.8rem', color: 'var(--fg-muted)', margin: '0 0 0.25rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--fg)' }}>Authors: </span>
                    {Array.isArray(pub.authors) ? pub.authors.join(', ') : pub.authors}
                  </p>

                  <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent)', fontWeight: 650, fontSize: '0.825rem', margin: 0, flexWrap: 'wrap' }}>
                    <BookOpen size={13} />
                    <span>{pub.source}{pub.volume && `, ${pub.volume}`}{pub.pages && `, pp. ${pub.pages}`}</span>
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.45rem', flexShrink: 0, alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--fg-muted)', opacity: 0.6, marginRight: '0.35rem' }}>
                    #{pub.order}
                  </span>
                  {pub.link && (
                    <a
                      href={pub.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline"
                      style={{ padding: '0.4rem 0.65rem', fontSize: '0.775rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                      title="View paper"
                    >
                      <ExternalLink size={12} />
                    </a>
                  )}
                  <button
                    onClick={() => openEditPub(pub)}
                    className="btn btn-outline"
                    style={{ padding: '0.4rem 0.75rem', fontSize: '0.775rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <Pencil size={12} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setDeleteId(pub._id)}
                    className="btn btn-outline"
                    style={{ padding: '0.4rem 0.6rem', color: '#ef4444', borderColor: 'var(--border)' }}
                    title="Delete publication"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Drawer 1: Publication Item Create / Edit Drawer ──────────────── */}
      <Drawer open={pubDrawerOpen} onOpenChange={setPubDrawerOpen}>
        <DrawerContent width="max-w-2xl">
          <form onSubmit={handlePubSubmit(onPubSubmit)} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            
            <DrawerHeader>
              <DrawerTitle>{editPublication ? 'Edit Research Publication' : 'Add Research Publication'}</DrawerTitle>
              <DrawerDescription>
                Configure article title, authors list, journal venue, publication status, volume/pages, and DOI link.
              </DrawerDescription>
            </DrawerHeader>

            <DrawerBody>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
                
                {/* Live Card Preview */}
                <div style={{ padding: '1rem 1.25rem', backgroundColor: 'var(--bg-elevated)', borderRadius: '14px', border: '1px solid var(--border)' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--fg-muted)', marginBottom: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Live Preview in Portfolio Grid
                  </p>
                  <div style={{ padding: '1.15rem', backgroundColor: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>
                        {currentStatus === 'published' ? 'Published & Indexed' : currentStatus === 'underReview' ? 'Manuscript Under Review' : 'Research Assistant Work'}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--fg-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Calendar size={10} style={{ color: 'var(--accent)' }} />
                        <span>{currentYear || '2025'}</span>
                      </span>
                    </div>

                    <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--fg)', margin: 0, lineHeight: 1.35 }}>
                      {currentTitle || 'Exploring the Socioeconomic and Emotional Effects of Divorce...'}
                    </h4>

                    <p style={{ fontSize: '0.75rem', color: 'var(--fg-muted)', margin: 0 }}>
                      <span style={{ fontWeight: 600, color: 'var(--fg)' }}>Authors: </span>
                      {currentAuthors || 'Sourov, A., Shuvo, M.'}
                    </p>

                    <p style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent)', fontWeight: 650, fontSize: '0.775rem', margin: 0 }}>
                      <BookOpen size={12} />
                      <span>{currentSource || 'Journal of Social Sciences'}{currentVolume && `, ${currentVolume}`}{currentPages && `, pp. ${currentPages}`}</span>
                    </p>
                  </div>
                </div>

                {/* Paper Title */}
                <div>
                  <label className="admin-label">Paper / Article Title *</label>
                  <input
                    {...registerPub('title')}
                    className="admin-input"
                    placeholder="e.g. Exploring the Socioeconomic and Emotional Effects of Divorce on Women..."
                  />
                  {pubErrors.title && (
                    <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: '0.2rem 0 0' }}>
                      {pubErrors.title.message}
                    </p>
                  )}
                </div>

                {/* Authors & Status Dropdown */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label className="admin-label">Authors (comma separated) *</label>
                    <input
                      {...registerPub('authorsString')}
                      className="admin-input"
                      placeholder="e.g. Sourov, A., Shuvo, M."
                    />
                    {pubErrors.authorsString && (
                      <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: '0.2rem 0 0' }}>
                        {pubErrors.authorsString.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="admin-label">Publication Status *</label>
                    <Controller
                      name="status"
                      control={pubControl}
                      render={({ field }) => (
                        <CustomSelect
                          value={field.value}
                          onChange={(val) => field.onChange(val as 'published' | 'underReview' | 'researchAssistant')}
                          options={STATUS_OPTIONS}
                        />
                      )}
                    />
                  </div>
                </div>

                {/* Journal Source & Year */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="admin-label">Journal / Book / Conference Venue *</label>
                    <input
                      {...registerPub('source')}
                      className="admin-input"
                      placeholder="e.g. Asian Journal of Arts and Social Sciences"
                    />
                    {pubErrors.source && (
                      <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: '0.2rem 0 0' }}>
                        {pubErrors.source.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="admin-label">Year *</label>
                    <input
                      type="number"
                      {...registerPub('year', { valueAsNumber: true })}
                      className="admin-input"
                      placeholder="2025"
                    />
                    {pubErrors.year && (
                      <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: '0.2rem 0 0' }}>
                        {pubErrors.year.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Volume, Pages, & Order */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label className="admin-label">Volume / Issue</label>
                    <input
                      {...registerPub('volume')}
                      className="admin-input"
                      placeholder="e.g. 1(1) or Vol. 4"
                    />
                  </div>

                  <div>
                    <label className="admin-label">Page Range</label>
                    <input
                      {...registerPub('pages')}
                      className="admin-input"
                      placeholder="e.g. pp. 1–7"
                    />
                  </div>

                  <div>
                    <label className="admin-label">Display Order</label>
                    <input
                      type="number"
                      {...registerPub('order', { valueAsNumber: true })}
                      className="admin-input"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* DOI / External URL Link */}
                <div>
                  <label className="admin-label">Paper DOI or External Reading Link</label>
                  <input
                    {...registerPub('link')}
                    className="admin-input"
                    placeholder="https://doi.org/10.1234/journal.2025.01"
                  />
                  {pubErrors.link && (
                    <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: '0.2rem 0 0' }}>
                      {pubErrors.link.message}
                    </p>
                  )}
                </div>

                {/* Short Abstract / Summary */}
                <div>
                  <label className="admin-label">Short Description / Key Findings</label>
                  <textarea
                    {...registerPub('description')}
                    className="admin-input"
                    rows={3}
                    style={{
                      height: 'auto',
                      minHeight: '80px',
                      padding: '0.75rem 0.95rem',
                      lineHeight: 1.6,
                    }}
                    placeholder="Empirical findings, research methodology, sample demographics..."
                  />
                </div>

              </div>
            </DrawerBody>

            <DrawerFooter>
              <button
                type="button"
                onClick={() => setPubDrawerOpen(false)}
                className="btn btn-outline"
                style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem', borderRadius: '10px' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isPubDirty || isPubSubmitting || savePubMutation.isPending}
                className="btn btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.55rem 1.5rem',
                  fontSize: '0.85rem',
                  borderRadius: '10px',
                  opacity: !isPubDirty ? 0.45 : 1,
                  cursor: !isPubDirty ? 'not-allowed' : 'pointer',
                  transition: 'opacity 0.15s ease',
                }}
              >
                {isPubSubmitting || savePubMutation.isPending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Saving Publication...</span>
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    <span>Save Publication</span>
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
              <DrawerTitle>Customize Publications Section Header</DrawerTitle>
              <DrawerDescription>
                Customize badge, main title, and descriptive subtitle shown above the research publications.
              </DrawerDescription>
            </DrawerHeader>

            <DrawerBody>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label className="admin-label">Section Badge</label>
                  <input
                    {...registerHeader('badge')}
                    className="admin-input"
                    placeholder="Academic Scholarship & Papers"
                  />
                </div>

                <div>
                  <label className="admin-label">Section Title</label>
                  <input
                    {...registerHeader('title')}
                    className="admin-input"
                    placeholder="Research & Publications"
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
                    placeholder="Peer-reviewed empirical studies and ongoing manuscripts addressing vulnerable communities, socio-economic dynamics, and char region livelihood deprivations."
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
                Are you sure you want to delete this research publication? It will immediately be removed from your portfolio.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <button onClick={() => setDeleteId(null)} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                  Cancel
                </button>
                <button
                  onClick={() => deletePubMutation.mutate(deleteId!)}
                  disabled={deletePubMutation.isPending}
                  className="btn btn-primary"
                  style={{ backgroundColor: '#ef4444', borderColor: '#ef4444', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  {deletePubMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  <span>Delete Paper</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
