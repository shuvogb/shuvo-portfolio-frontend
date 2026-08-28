'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Loader2, Key, Info } from 'lucide-react';
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
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>
          Settings
        </h1>
        <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>
          Security preferences and system configuration.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '520px' }}>
        
        {/* Change Password Card */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Key size={18} style={{ color: 'var(--primary)' }} />
            <h2 style={{ fontSize: '1.15rem' }}>
              Change Password
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Current Password *
                </label>
                <input
                  type="password"
                  autoComplete="current-password"
                  {...register('currentPassword')}
                  className="input"
                  placeholder="••••••••"
                />
                {errors.currentPassword && (
                  <p role="alert" style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    {errors.currentPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  New Password *
                </label>
                <input
                  type="password"
                  autoComplete="new-password"
                  {...register('newPassword')}
                  className="input"
                  placeholder="Minimum 8 characters"
                />
                {errors.newPassword && (
                  <p role="alert" style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  autoComplete="new-password"
                  {...register('confirmPassword')}
                  className="input"
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p role="alert" style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
                style={{ width: '100%', opacity: isSubmitting ? 0.75 : 1, marginTop: '0.5rem' }}
              >
                {isSubmitting ? (
                  <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Updating...</>
                ) : (
                  <><Lock size={15} /> Update Password</>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* System Info */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Info size={18} style={{ color: 'var(--primary)' }} />
            <h2 style={{ fontSize: '1.1rem' }}>
              System Information
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Theme Mode</span>
              <span className="mono" style={{ textTransform: 'capitalize', color: 'var(--primary)' }}>System Default</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Runtime Engine</span>
              <span className="mono">Bun</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Database</span>
              <span className="mono">MongoDB Atlas</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Media CDN</span>
              <span className="mono">Cloudinary</span>
            </div>
          </div>
        </div>

      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
