'use client';

import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Loader2, Upload, Plus, Trash2, EyeOff } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

const referenceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  title: z.string().min(1, 'Title is required'),
  institution: z.string().min(1, 'Institution is required'),
  phone: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  isPublic: z.boolean().optional(),
});

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  headline: z.string().min(1, 'Headline is required'),
  summary: z.string().min(10, 'Summary must be at least 10 chars'),
  avatarUrl: z.string().optional(),
  presentAddress: z.string().optional(),
  permanentAddress: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  socialLinks: z.object({
    linkedin: z.string().url('Invalid URL').optional().or(z.literal('')),
    orcid: z.string().url('Invalid URL').optional().or(z.literal('')),
    researchGate: z.string().url('Invalid URL').optional().or(z.literal('')),
    github: z.string().url('Invalid URL').optional().or(z.literal('')),
    twitter: z.string().url('Invalid URL').optional().or(z.literal('')),
  }).optional(),
  privateInfo: z.object({
    fathersName: z.string().optional(),
    mothersName: z.string().optional(),
    dateOfBirth: z.string().optional(),
    gender: z.string().optional(),
    maritalStatus: z.string().optional(),
    nationality: z.string().optional(),
    religion: z.string().optional(),
    bloodGroup: z.string().optional(),
  }).optional(),
  references: z.array(referenceSchema).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function AdminProfilePage() {
  const qc = useQueryClient();
  const [uploading, setUploading] = useState(false);

  const { data: profile, isLoading } = useQuery<ProfileFormValues>({
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
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      socialLinks: {},
      privateInfo: {},
      references: [],
    },
  });

  useEffect(() => {
    if (profile) {
      reset(profile);
    }
  }, [profile, reset]);

  const references = watch('references') || [];

  const addReference = () => {
    setValue('references', [
      ...references,
      { name: '', title: '', institution: '', phone: '', email: '', isPublic: false },
    ]);
  };

  const removeReference = (index: number) => {
    setValue('references', references.filter((_, i) => i !== index));
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('altText', 'Profile photo');

    try {
      setUploading(true);
      const res = await api.post('/admin/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setValue('avatarUrl', res.data.data.url);
      toast.success('Avatar uploaded successfully!');
    } catch {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const saveMutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      return api.put('/admin/profile', data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-profile'] });
      qc.invalidateQueries({ queryKey: ['portfolio'] });
      toast.success('Profile updated successfully!');
    },
    onError: () => {
      toast.error('Failed to update profile.');
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    await saveMutation.mutateAsync(data);
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="skeleton" style={{ height: '40px', width: '200px' }} />
        <div className="skeleton" style={{ height: '400px' }} />
      </div>
    );
  }

  const avatarUrl = watch('avatarUrl');

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>
          Edit Profile
        </h1>
        <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>
          Manage your personal details, public visibility, and CV information.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Main Info */}
          <div className="card">
            <h2 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>
              Basic Information
            </h2>

            {/* Avatar section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
              <div
                style={{
                  width: '72px', height: '72px',
                  borderRadius: 'var(--radius)',
                  backgroundColor: 'var(--primary-subtle)',
                  color: 'var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '1.5rem',
                  overflow: 'hidden', flexShrink: 0,
                  border: '1px solid var(--primary-border)',
                }}
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  'SM'
                )}
              </div>
              <div>
                <label className="btn btn-secondary" style={{ cursor: 'pointer', fontSize: '0.85rem' }}>
                  {uploading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Upload size={14} />}
                  {uploading ? 'Uploading...' : 'Upload Photo'}
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} disabled={uploading} />
                </label>
                <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginTop: '0.35rem' }}>
                  JPG, PNG or WebP. Cloudinary storage.
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Full Name *
                </label>
                <input {...register('name')} className="input" placeholder="Shuvo Molla" />
                {errors.name && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.name.message}</p>}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Headline *
                </label>
                <input {...register('headline')} className="input" placeholder="Sociology & Social Work Researcher" />
                {errors.headline && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.headline.message}</p>}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Email Address
                </label>
                <input {...register('email')} className="input" placeholder="you@example.com" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Phone Number
                </label>
                <input {...register('phone')} className="input" placeholder="+880 1..." />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Present Address
                </label>
                <input {...register('presentAddress')} className="input" placeholder="Ashulia, Savar, Dhaka" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Permanent Address
                </label>
                <input {...register('permanentAddress')} className="input" placeholder="Rajbari, Bangladesh" />
              </div>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Summary / Bio *
              </label>
              <textarea {...register('summary')} rows={4} className="input" style={{ resize: 'vertical' }} />
              {errors.summary && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.summary.message}</p>}
            </div>
          </div>

          {/* Social Links */}
          <div className="card">
            <h2 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>
              Social & Academic Profiles
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>LinkedIn URL</label>
                <input {...register('socialLinks.linkedin')} className="input" placeholder="https://linkedin.com/in/..." />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>ResearchGate URL</label>
                <input {...register('socialLinks.researchGate')} className="input" placeholder="https://researchgate.net/profile/..." />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>ORCID URL</label>
                <input {...register('socialLinks.orcid')} className="input" placeholder="https://orcid.org/..." />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>GitHub URL</label>
                <input {...register('socialLinks.github')} className="input" placeholder="https://github.com/..." />
              </div>
            </div>
          </div>

          {/* Private Personal Info (CMS Only) */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <EyeOff size={16} style={{ color: 'var(--primary)' }} />
              <h2 style={{ fontSize: '1.15rem' }}>
                Private Personal Data (Stored in CMS Only)
              </h2>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', marginBottom: '1.25rem' }}>
              These values are kept confidential and hidden from the public website.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Father's Name</label>
                <input {...register('privateInfo.fathersName')} className="input" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Mother's Name</label>
                <input {...register('privateInfo.mothersName')} className="input" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Date of Birth</label>
                <input {...register('privateInfo.dateOfBirth')} className="input" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Gender</label>
                <input {...register('privateInfo.gender')} className="input" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Marital Status</label>
                <input {...register('privateInfo.maritalStatus')} className="input" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Nationality</label>
                <input {...register('privateInfo.nationality')} className="input" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Religion</label>
                <input {...register('privateInfo.religion')} className="input" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Blood Group</label>
                <input {...register('privateInfo.bloodGroup')} className="input" />
              </div>
            </div>
          </div>

          {/* References */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.15rem' }}>
                Academic References
              </h2>
              <button
                type="button"
                onClick={addReference}
                className="btn btn-secondary"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
              >
                <Plus size={14} /> Add Reference
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {references.map((ref, index) => (
                <div
                  key={index}
                  style={{
                    padding: '1.25rem',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--muted)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Reference #{index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeReference(index)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Name *</label>
                      <input {...register(`references.${index}.name`)} className="input" />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Designation *</label>
                      <input {...register(`references.${index}.title`)} className="input" />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Institution *</label>
                      <input {...register(`references.${index}.institution`)} className="input" />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Phone</label>
                      <input {...register(`references.${index}.phone`)} className="input" />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Email</label>
                      <input {...register(`references.${index}.email`)} className="input" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button
              type="submit"
              disabled={isSubmitting || saveMutation.isPending}
              className="btn btn-primary"
              style={{ minWidth: '180px' }}
            >
              {isSubmitting || saveMutation.isPending ? (
                <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</>
              ) : (
                <><Save size={15} /> Save Changes</>
              )}
            </button>
          </div>

        </div>
      </form>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
