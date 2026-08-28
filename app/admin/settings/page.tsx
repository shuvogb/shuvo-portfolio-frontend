'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Loader2, Key, Info, Server, Database, Cloud, ShieldCheck, CheckCircle2 } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function AdminSettingsPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: PasswordFormData) => {
    try {
      await api.post('/auth/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password changed successfully');
      reset();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to change password';
      toast.error(msg);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Page Header Block */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--fg)', letterSpacing: '-0.03em', marginBottom: '0.35rem' }}>
          Settings & Preferences
        </h1>
        <p style={{ color: 'var(--fg-muted)', fontSize: '0.9rem', margin: 0 }}>
          Manage your administrative credentials, security parameters, and runtime environment.
        </p>
      </div>

      {/* 2-Column Responsive Shadcn Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.75rem', alignItems: 'start' }}>
        
        {/* Card 1: Change Password Block */}
        <div className="card" style={{ padding: 0 }}>
          <div className="card-header" style={{ padding: '1.5rem 1.75rem 1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '9px',
                  backgroundColor: 'var(--accent-subtle)',
                  color: 'var(--accent)',
                  border: '1px solid var(--accent-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Key size={16} strokeWidth={2} />
              </div>
              <div>
                <h2 className="card-title" style={{ fontSize: '1.05rem' }}>
                  Authentication & Password
                </h2>
                <p className="card-description">
                  Update your admin account access credentials
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ padding: '1.5rem 1.75rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              
              {/* Current Password */}
              <div>
                <label className="admin-label">
                  Current Password <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-muted)', pointerEvents: 'none' }} />
                  <input
                    type="password"
                    autoComplete="current-password"
                    {...register('currentPassword')}
                    className="admin-input"
                    placeholder="••••••••"
                    style={{ paddingLeft: '2.5rem' }}
                    aria-invalid={!!errors.currentPassword}
                  />
                </div>
                {errors.currentPassword && (
                  <p role="alert" style={{ color: '#ef4444', fontSize: '0.785rem', marginTop: '0.35rem', fontWeight: 500 }}>
                    {errors.currentPassword.message}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label className="admin-label">
                  New Password <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-muted)', pointerEvents: 'none' }} />
                  <input
                    type="password"
                    autoComplete="new-password"
                    {...register('newPassword')}
                    className="admin-input"
                    placeholder="Minimum 8 characters"
                    style={{ paddingLeft: '2.5rem' }}
                    aria-invalid={!!errors.newPassword}
                  />
                </div>
                {errors.newPassword && (
                  <p role="alert" style={{ color: '#ef4444', fontSize: '0.785rem', marginTop: '0.35rem', fontWeight: 500 }}>
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="admin-label">
                  Confirm New Password <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-muted)', pointerEvents: 'none' }} />
                  <input
                    type="password"
                    autoComplete="new-password"
                    {...register('confirmPassword')}
                    className="admin-input"
                    placeholder="••••••••"
                    style={{ paddingLeft: '2.5rem' }}
                    aria-invalid={!!errors.confirmPassword}
                  />
                </div>
                {errors.confirmPassword && (
                  <p role="alert" style={{ color: '#ef4444', fontSize: '0.785rem', marginTop: '0.35rem', fontWeight: 500 }}>
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  height: '42px',
                  borderRadius: '10px',
                  fontSize: '0.875rem',
                  fontWeight: 650,
                  marginTop: '0.5rem',
                  opacity: isSubmitting ? 0.75 : 1,
                  gap: '0.5rem',
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <Lock size={14} />
                    <span>Save New Password</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Column 2: System Infrastructure & Security Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* System Environment Block */}
          <div className="card" style={{ padding: '1.5rem 1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '9px',
                  backgroundColor: 'var(--bg-elevated)',
                  color: 'var(--fg)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Server size={16} strokeWidth={2} />
              </div>
              <div>
                <h2 className="card-title" style={{ fontSize: '1.05rem' }}>
                  Runtime & Infrastructure
                </h2>
                <p className="card-description">
                  System runtime and database connections
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.85rem' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.85rem', borderRadius: '10px', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--fg-muted)', fontWeight: 500 }}>Runtime Engine</span>
                <span style={{ fontWeight: 700, color: 'var(--fg)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                  Bun v1.2+
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.85rem', borderRadius: '10px', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--fg-muted)', fontWeight: 500 }}>Database Cluster</span>
                <span style={{ fontWeight: 700, color: 'var(--fg)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Database size={13} style={{ color: 'var(--accent)' }} />
                  MongoDB Atlas
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.85rem', borderRadius: '10px', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--fg-muted)', fontWeight: 500 }}>Media CDN</span>
                <span style={{ fontWeight: 700, color: 'var(--fg)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Cloud size={13} style={{ color: 'var(--accent)' }} />
                  Cloudinary
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.85rem', borderRadius: '10px', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--fg-muted)', fontWeight: 500 }}>API Protocol</span>
                <span style={{ fontWeight: 700, color: 'var(--fg)' }}>
                  REST / JSON
                </span>
              </div>

            </div>
          </div>

          {/* Security Recommendations Block */}
          <div className="card" style={{ padding: '1.25rem 1.5rem', backgroundColor: 'var(--accent-subtle)', borderColor: 'var(--accent-border)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <ShieldCheck size={20} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--fg)', margin: 0 }}>
                  Security Best Practices
                </p>
                <p style={{ fontSize: '0.785rem', color: 'var(--fg-muted)', margin: '0.25rem 0 0 0', lineHeight: 1.45 }}>
                  Always use passwords containing at least 8 characters, combining uppercase, lowercase, numbers, and special symbols.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
