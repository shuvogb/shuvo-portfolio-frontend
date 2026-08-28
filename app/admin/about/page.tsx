'use client';

import { useEffect, useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Save,
  Loader2,
  Plus,
  Trash2,
  SlidersHorizontal,
  Mail,
  Phone,
  MapPin,
  Compass,
  CheckCircle2,
  BarChart3,
  Globe,
  User,
  ShieldCheck,
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

const referenceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  title: z.string().min(1, 'Title is required'),
  institution: z.string().min(1, 'Institution is required'),
  phone: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  isPublic: z.boolean().optional(),
});

const researchPillarSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  icon: z.string().optional(),
});

const aboutFormSchema = z.object({
  aboutSection: z.object({
    badge: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    department: z.string().optional(),
    university: z.string().optional(),
    philosophyBadge: z.string().optional(),
    philosophyTitle: z.string().optional(),
    philosophyDescription: z.string().optional(),
    pillars: z.array(researchPillarSchema).optional(),
    refereesBadge: z.string().optional(),
    refereesTitle: z.string().optional(),
  }),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  presentAddress: z.string().optional(),
  socialLinks: z
    .object({
      linkedin: z.string().url('Invalid URL').optional().or(z.literal('')),
      facebook: z.string().url('Invalid URL').optional().or(z.literal('')),
      researchGate: z.string().url('Invalid URL').optional().or(z.literal('')),
      orcid: z.string().optional(),
      github: z.string().url('Invalid URL').optional().or(z.literal('')),
      twitter: z.string().url('Invalid URL').optional().or(z.literal('')),
    })
    .optional(),
  references: z.array(referenceSchema).optional(),
});

type AboutFormValues = z.infer<typeof aboutFormSchema>;

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

export default function AdminAboutPage() {
  const qc = useQueryClient();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const philosophyTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Fetch current profile & aboutSection data
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
    control,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<AboutFormValues>({
    resolver: zodResolver(aboutFormSchema),
    defaultValues: {
      aboutSection: {
        badge: 'Academic Bio & Background',
        title: 'Background & Scholarship',
        description:
          'Sociology and Social Work researcher with deep focus on empirical methodologies, statistical modeling with SPSS, and grassroots community initiatives.',
        department: 'Sociology & Social Work',
        university: 'Gono Bishwabidyalay · Savar',
        philosophyBadge: 'Empirical Inquiry',
        philosophyTitle: 'Research Philosophy & Focus',
        philosophyDescription:
          'Sociology and Social Work undergraduate with hands-on experience in social research, data collection, and community development. Skilled in quantitative research methods and SPSS, with a demonstrated ability to coordinate events and engage in social advocacy.',
        pillars: [
          { title: 'Quantitative', description: 'Cross-sectional surveys, SPSS statistical analysis, and demographic modeling.' },
          { title: 'Char Studies', description: 'Multidimensional deprivation, climate resilience, and riverine char communities.' },
          { title: 'Advocacy', description: 'Youth mobilization, climate justice with YouthNet, and career mentorship.' },
        ],
        refereesBadge: 'Verified Faculty',
        refereesTitle: 'Academic Mentors & Institutional Referees',
      },
      email: '',
      phone: '',
      presentAddress: '',
      socialLinks: {},
      references: [],
    },
  });

  const philosophyValue = watch('aboutSection.philosophyDescription');

  useEffect(() => {
    if (philosophyTextareaRef.current) {
      philosophyTextareaRef.current.style.height = 'auto';
      philosophyTextareaRef.current.style.height = `${Math.max(
        philosophyTextareaRef.current.scrollHeight,
        100
      )}px`;
    }
  }, [philosophyValue, drawerOpen]);

  const { fields: refFields, append: appendRef, remove: removeRef } = useFieldArray({
    control,
    name: 'references',
  });

  useEffect(() => {
    if (profile) {
      reset({
        aboutSection: {
          badge: profile.aboutSection?.badge || 'Academic Bio & Background',
          title: profile.aboutSection?.title || 'Background & Scholarship',
          description:
            profile.aboutSection?.description ||
            'Sociology and Social Work researcher with deep focus on empirical methodologies, statistical modeling with SPSS, and grassroots community initiatives.',
          department: profile.aboutSection?.department || 'Sociology & Social Work',
          university: profile.aboutSection?.university || 'Gono Bishwabidyalay · Savar',
          philosophyBadge: profile.aboutSection?.philosophyBadge || 'Empirical Inquiry',
          philosophyTitle: profile.aboutSection?.philosophyTitle || 'Research Philosophy & Focus',
          philosophyDescription:
            profile.aboutSection?.philosophyDescription ||
            'Sociology and Social Work undergraduate with hands-on experience in social research, data collection, and community development. Skilled in quantitative research methods and SPSS, with a demonstrated ability to coordinate events and engage in social advocacy.',
          pillars:
            profile.aboutSection?.pillars && profile.aboutSection.pillars.length > 0
              ? profile.aboutSection.pillars
              : [
                  { title: 'Quantitative', description: 'Cross-sectional surveys, SPSS statistical analysis, and demographic modeling.' },
                  { title: 'Char Studies', description: 'Multidimensional deprivation, climate resilience, and riverine char communities.' },
                  { title: 'Advocacy', description: 'Youth mobilization, climate justice with YouthNet, and career mentorship.' },
                ],
          refereesBadge: profile.aboutSection?.refereesBadge || 'Verified Faculty',
          refereesTitle: profile.aboutSection?.refereesTitle || 'Academic Mentors & Institutional Referees',
        },
        email: profile.email || '',
        phone: profile.phone || '',
        presentAddress: profile.presentAddress || '',
        socialLinks: profile.socialLinks || {},
        references: profile.references || [],
      });
    }
  }, [profile, reset]);

  const saveMutation = useMutation({
    mutationFn: async (data: AboutFormValues) => {
      return api.put('/admin/profile', {
        ...profile,
        aboutSection: data.aboutSection,
        email: data.email,
        phone: data.phone,
        presentAddress: data.presentAddress,
        socialLinks: data.socialLinks,
        references: data.references,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-profile'] });
      qc.invalidateQueries({ queryKey: ['portfolio'] });
      toast.success('Background & Scholarship updated successfully!');
      setDrawerOpen(false);
    },
    onError: () => {
      toast.error('Failed to update Background & Scholarship. Please check fields.');
    },
  });

  const onSubmit = async (data: AboutFormValues) => {
    await saveMutation.mutateAsync(data);
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="skeleton" style={{ height: '40px', width: '300px' }} />
        <div className="skeleton" style={{ height: '400px' }} />
      </div>
    );
  }

  const currentBadge = watch('aboutSection.badge') || 'Academic Bio & Background';
  const currentTitle = watch('aboutSection.title') || 'Background & Scholarship';
  const currentDesc =
    watch('aboutSection.description') ||
    'Sociology and Social Work researcher with deep focus on empirical methodologies...';
  const currentDept = watch('aboutSection.department') || 'Sociology & Social Work';
  const currentUni = watch('aboutSection.university') || 'Gono Bishwabidyalay · Savar';
  const currentPhilosophyBadge = watch('aboutSection.philosophyBadge') || 'Empirical Inquiry';
  const currentPhilosophyTitle = watch('aboutSection.philosophyTitle') || 'Research Philosophy & Focus';
  const currentPhilosophyDesc =
    watch('aboutSection.philosophyDescription') ||
    'Sociology and Social Work undergraduate with hands-on experience in social research...';
  const currentPillars = watch('aboutSection.pillars') || [
    { title: 'Quantitative', description: 'Cross-sectional surveys, SPSS statistical analysis, and demographic modeling.' },
    { title: 'Char Studies', description: 'Multidimensional deprivation, climate resilience, and riverine char communities.' },
    { title: 'Advocacy', description: 'Youth mobilization, climate justice with YouthNet, and career mentorship.' },
  ];
  const currentEmail = watch('email') || profile?.email || '';
  const currentPhone = watch('phone') || profile?.phone || '';
  const currentAddress = watch('presentAddress') || profile?.presentAddress || '';
  const currentSocial = watch('socialLinks') || profile?.socialLinks || {};

  const currentRefereesBadge = watch('aboutSection.refereesBadge') || 'Verified Faculty';
  const currentRefereesTitle =
    watch('aboutSection.refereesTitle') || 'Academic Mentors & Institutional Referees';
  const currentReferees = watch('references') || [];

  const { ref: philosophyFormRef, ...restPhilosophy } = register('aboutSection.philosophyDescription');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Top Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--fg)', letterSpacing: '-0.03em', marginBottom: '0.35rem' }}>
            Background & Scholarship
          </h1>
          <p style={{ color: 'var(--fg-muted)', fontSize: '0.9rem', margin: 0 }}>
            Manage the academic biography, contact info, social links, research philosophy, focus pillars, and verified mentors.
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

      {/* Live Visual Preview Card */}
      <div className="card bezel-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--fg)' }}>
              Live Background & Scholarship Configuration
            </h2>
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)', backgroundColor: 'var(--accent-subtle)', padding: '0.3rem 0.75rem', borderRadius: '9999px', border: '1px solid var(--accent-border)' }}>
            Editable via Slide-Over Drawer
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Header Preview */}
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)', backgroundColor: 'var(--accent-subtle)', border: '1px solid var(--accent-border)', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
              {currentBadge}
            </span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--fg)', margin: '0.5rem 0 0.35rem', letterSpacing: '-0.02em' }}>
              {currentTitle}
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--fg-muted)', margin: 0, maxWidth: '800px', lineHeight: 1.6 }}>
              {currentDesc}
            </p>
          </div>

          {/* Cards Grid Preview */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', alignItems: 'stretch' }}>
            
            {/* Identity Card */}
            <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-elevated)', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                  <img
                    src={profile?.avatarUrl || '/images/shuvo.png'}
                    alt="Avatar"
                    style={{ width: '56px', height: '56px', borderRadius: '14px', objectFit: 'cover', border: '1px solid var(--border)' }}
                  />
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--fg)' }}>
                      {profile?.name || 'Shuvo Molla'}
                    </h4>
                    <p style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--accent)', margin: '0.1rem 0 0' }}>
                      {currentDept}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--fg-muted)', margin: 0 }}>
                      {currentUni}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {currentEmail && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--fg)', padding: '0.45rem 0.65rem', backgroundColor: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                      <Mail size={13} style={{ color: 'var(--accent)' }} />
                      <span>{currentEmail}</span>
                    </div>
                  )}
                  {currentPhone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--fg)', padding: '0.45rem 0.65rem', backgroundColor: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                      <Phone size={13} style={{ color: 'var(--accent)' }} />
                      <span>{currentPhone}</span>
                    </div>
                  )}
                  {currentAddress && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--fg-muted)', padding: '0.45rem 0.65rem', backgroundColor: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                      <MapPin size={13} style={{ color: 'var(--accent)' }} />
                      <span>{currentAddress}</span>
                    </div>
                  )}
                </div>

                {/* Social links row */}
                {(currentSocial.linkedin || currentSocial.facebook) && (
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.85rem' }}>
                    {currentSocial.linkedin && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <FiLinkedin size={12} /> LinkedIn
                      </span>
                    )}
                    {currentSocial.facebook && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <FiFacebook size={12} /> Facebook
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Philosophy Card */}
            <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-elevated)', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Compass size={16} style={{ color: 'var(--accent)' }} />
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: 'var(--fg)' }}>
                      {currentPhilosophyTitle}
                    </h4>
                  </div>
                  <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                    <CheckCircle2 size={11} /> {currentPhilosophyBadge}
                  </span>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--fg-muted)', lineHeight: 1.6, margin: '0 0 1rem' }}>
                  {currentPhilosophyDesc}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                  {currentPillars.slice(0, 3).map((p, idx) => (
                    <div key={idx} style={{ padding: '0.6rem 0.75rem', backgroundColor: 'var(--bg-surface)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent)', marginBottom: '0.2rem' }}>
                        {idx === 0 ? <BarChart3 size={13} /> : idx === 1 ? <Globe size={13} /> : <User size={13} />}
                        <span style={{ fontSize: '0.75rem', fontWeight: 750, color: 'var(--fg)' }}>{p.title}</span>
                      </div>
                      <p style={{ fontSize: '0.675rem', color: 'var(--fg-muted)', margin: 0, lineHeight: 1.35 }}>
                        {p.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Referees Preview */}
          <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-elevated)', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={16} style={{ color: 'var(--accent)' }} />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: 'var(--fg)' }}>
                  {currentRefereesTitle}
                </h4>
              </div>
              <span className="badge" style={{ fontSize: '0.7rem' }}>
                <CheckCircle2 size={11} style={{ color: 'var(--accent)' }} /> {currentRefereesBadge}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
              {(currentReferees.length > 0
                ? currentReferees
                : [
                    { name: 'Dr. Md. Tariqul Islam', title: 'Director, Center for Multidisciplinary Research', institution: 'Gono Bishwabidyalay · Savar' },
                    { name: 'Dr. Subrina Rahman', title: 'Senior Lecturer, Dept. of Sociology & Social Work', institution: 'Gono Bishwabidyalay · Savar' },
                  ]
              ).map((ref, idx) => (
                <div key={idx} style={{ padding: '0.85rem', backgroundColor: 'var(--bg-surface)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                  <p style={{ fontSize: '0.85rem', fontWeight: 750, color: 'var(--fg)', margin: 0 }}>{ref.name}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600, margin: '0.1rem 0 0' }}>{ref.title}</p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--fg-muted)', margin: 0 }}>{ref.institution}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ─── Custom Slide-Over Edit Drawer ─────────────────────────────────── */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent width="max-w-3xl">
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            
            <DrawerHeader>
              <DrawerTitle>Customize Background & Scholarship</DrawerTitle>
              <DrawerDescription>
                Configure academic header, contact information, social links, research focus pillars, and institutional referees.
              </DrawerDescription>
            </DrawerHeader>

            <DrawerBody>
              
              {/* SECTION 1: Section Header & Overview */}
              <div style={{ padding: '1.4rem 1.6rem', backgroundColor: 'var(--bg-elevated)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <SectionBadgeNumber num="01" title="Section Header & Title" />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label className="admin-label">Section Badge</label>
                      <input {...register('aboutSection.badge')} className="admin-input" placeholder="Academic Bio & Background" />
                    </div>
                    <div>
                      <label className="admin-label">Section Title</label>
                      <input {...register('aboutSection.title')} className="admin-input" placeholder="Background & Scholarship" />
                    </div>
                  </div>

                  <div>
                    <label className="admin-label">Section Subtitle / Description</label>
                    <input {...register('aboutSection.description')} className="admin-input" placeholder="Sociology and Social Work researcher with deep focus on..." />
                  </div>
                </div>
              </div>

              {/* SECTION 2: Academic Department & Affiliation */}
              <div style={{ padding: '1.4rem 1.6rem', backgroundColor: 'var(--bg-elevated)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <SectionBadgeNumber num="02" title="Academic Affiliation" />

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label className="admin-label">Department / Field</label>
                    <input {...register('aboutSection.department')} className="admin-input" placeholder="Sociology & Social Work" />
                  </div>
                  <div>
                    <label className="admin-label">University / Institution</label>
                    <input {...register('aboutSection.university')} className="admin-input" placeholder="Gono Bishwabidyalay · Savar" />
                  </div>
                </div>
              </div>

              {/* SECTION 3: Public Contact & Location */}
              <div style={{ padding: '1.4rem 1.6rem', backgroundColor: 'var(--bg-elevated)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <SectionBadgeNumber num="03" title="Public Contact & Location" />

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label className="admin-label">Public Email</label>
                    <input {...register('email')} className="admin-input" placeholder="shuvomolla7374@gmail.com" />
                    {errors.email && <span className="text-xs text-red-500 mt-1 block">{errors.email.message}</span>}
                  </div>
                  <div>
                    <label className="admin-label">Public Phone</label>
                    <input {...register('phone')} className="admin-input" placeholder="+880 1607-065888" />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label className="admin-label">Present Address</label>
                    <input {...register('presentAddress')} className="admin-input" placeholder="Ashulia, Savar, Dhaka" />
                  </div>
                </div>
              </div>

              {/* SECTION 4: Social & Academic Profiles */}
              <div style={{ padding: '1.4rem 1.6rem', backgroundColor: 'var(--bg-elevated)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <SectionBadgeNumber num="04" title="Social & Academic Profiles" />

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label className="admin-label">LinkedIn URL</label>
                    <input {...register('socialLinks.linkedin')} className="admin-input" placeholder="https://linkedin.com/in/..." />
                  </div>
                  <div>
                    <label className="admin-label">Facebook URL</label>
                    <input {...register('socialLinks.facebook')} className="admin-input" placeholder="https://facebook.com/..." />
                  </div>
                  <div>
                    <label className="admin-label">ResearchGate URL</label>
                    <input {...register('socialLinks.researchGate')} className="admin-input" placeholder="https://researchgate.net/profile/..." />
                  </div>
                  <div>
                    <label className="admin-label">ORCID Identifier</label>
                    <input {...register('socialLinks.orcid')} className="admin-input" placeholder="0000-0002-..." />
                  </div>
                  <div>
                    <label className="admin-label">GitHub URL</label>
                    <input {...register('socialLinks.github')} className="admin-input" placeholder="https://github.com/..." />
                  </div>
                  <div>
                    <label className="admin-label">Twitter / X URL</label>
                    <input {...register('socialLinks.twitter')} className="admin-input" placeholder="https://x.com/..." />
                  </div>
                </div>
              </div>

              {/* SECTION 5: Research Philosophy & Focus */}
              <div style={{ padding: '1.4rem 1.6rem', backgroundColor: 'var(--bg-elevated)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <SectionBadgeNumber num="05" title="Research Philosophy & Narrative" />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label className="admin-label">Philosophy Badge</label>
                      <input {...register('aboutSection.philosophyBadge')} className="admin-input" placeholder="Empirical Inquiry" />
                    </div>
                    <div>
                      <label className="admin-label">Philosophy Heading</label>
                      <input {...register('aboutSection.philosophyTitle')} className="admin-input" placeholder="Research Philosophy & Focus" />
                    </div>
                  </div>

                  <div>
                    <label className="admin-label">Philosophy Narrative</label>
                    <textarea
                      {...restPhilosophy}
                      ref={(el) => {
                        philosophyFormRef(el);
                        philosophyTextareaRef.current = el;
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
                      placeholder="Sociology and Social Work undergraduate with hands-on experience in social research..."
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 6: 3 Research Focus Pillars */}
              <div style={{ padding: '1.4rem 1.6rem', backgroundColor: 'var(--bg-elevated)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <SectionBadgeNumber num="06" title="3 Research Focus Pillars" />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {/* Pillar 1 */}
                  <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <label className="text-[0.7rem] font-semibold text-[var(--accent)] mb-1 block">Pillar 1</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.65rem' }}>
                      <input {...register('aboutSection.pillars.0.title')} className="admin-input" placeholder="Quantitative" />
                      <input {...register('aboutSection.pillars.0.description')} className="admin-input" placeholder="Cross-sectional surveys, SPSS statistical analysis..." />
                    </div>
                  </div>

                  {/* Pillar 2 */}
                  <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <label className="text-[0.7rem] font-semibold text-[var(--accent)] mb-1 block">Pillar 2</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.65rem' }}>
                      <input {...register('aboutSection.pillars.1.title')} className="admin-input" placeholder="Char Studies" />
                      <input {...register('aboutSection.pillars.1.description')} className="admin-input" placeholder="Multidimensional deprivation, climate resilience..." />
                    </div>
                  </div>

                  {/* Pillar 3 */}
                  <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <label className="text-[0.7rem] font-semibold text-[var(--accent)] mb-1 block">Pillar 3</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.65rem' }}>
                      <input {...register('aboutSection.pillars.2.title')} className="admin-input" placeholder="Advocacy" />
                      <input {...register('aboutSection.pillars.2.description')} className="admin-input" placeholder="Youth mobilization, climate justice with YouthNet..." />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 7: Institutional Referees */}
              <div style={{ padding: '1.4rem 1.6rem', backgroundColor: 'var(--bg-elevated)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <SectionBadgeNumber num="07" title={`Academic Mentors & Referees (${refFields.length})`} />
                  <button
                    type="button"
                    onClick={() => appendRef({ name: '', title: '', institution: '', phone: '', email: '', isPublic: false })}
                    className="btn btn-outline"
                    style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem', borderRadius: '8px' }}
                  >
                    <Plus size={13} />
                    <span>Add Referee</span>
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div>
                    <label className="admin-label">Referees Card Badge</label>
                    <input {...register('aboutSection.refereesBadge')} className="admin-input" placeholder="Verified Faculty" />
                  </div>
                  <div>
                    <label className="admin-label">Referees Card Title</label>
                    <input {...register('aboutSection.refereesTitle')} className="admin-input" placeholder="Academic Mentors & Institutional Referees" />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {refFields.map((field, index) => (
                    <div key={field.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', backgroundColor: 'var(--bg-surface)', padding: '0.85rem', borderRadius: '10px', border: '1px solid var(--border)' }}>
                      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.65rem' }}>
                        <input {...register(`references.${index}.name` as const)} className="admin-input" placeholder="Referee Name" />
                        <input {...register(`references.${index}.title` as const)} className="admin-input" placeholder="Designation" />
                        <input {...register(`references.${index}.institution` as const)} className="admin-input" placeholder="Institution" />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeRef(index)}
                        style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}
                        title="Delete referee"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
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
