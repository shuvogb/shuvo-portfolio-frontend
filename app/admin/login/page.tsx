'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LogIn, Mail, Lock, Loader2, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginData = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginData) => {
    try {
      await api.post('/auth/login', data);
      const meRes = await api.get('/auth/me');
      setUser(meRes.data.data);
      toast.success('Welcome back!');
      router.push('/admin/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Login failed';
      toast.error(msg);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--muted)',
        padding: '1.5rem',
      }}
    >
      <div style={{ width: '100%', maxWidth: '400px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius)',
              backgroundColor: 'var(--primary)',
              color: 'var(--primary-foreground)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              fontWeight: 800,
              fontSize: '1.1rem',
            }}
          >
            SM
          </div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
            CMS Sign In
          </h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>
            Manage your portfolio content & analytics
          </p>
        </div>

        {/* Card */}
        <form onSubmit={handleSubmit(onSubmit)} className="card" noValidate>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Email */}
            <div>
              <label htmlFor="admin-email" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} />
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  {...register('email')}
                  className="input"
                  style={{ paddingLeft: '2.25rem' }}
                  placeholder="admin@example.com"
                  aria-invalid={!!errors.email}
                />
              </div>
              {errors.email && <p role="alert" style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="admin-password" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  {...register('password')}
                  className="input"
                  style={{ paddingLeft: '2.25rem', paddingRight: '2.25rem' }}
                  placeholder="••••••••"
                  aria-invalid={!!errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--muted-foreground)', padding: 0,
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p role="alert" style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{ width: '100%', opacity: isSubmitting ? 0.75 : 1 }}
            >
              {isSubmitting ? (
                <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Authenticating...</>
              ) : (
                <><LogIn size={15} /> Sign In</>
              )}
            </button>
          </div>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem' }}>
          <a href="/" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>← Return to Portfolio</a>
        </p>

      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
