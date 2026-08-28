'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LogIn, Mail, Lock, Loader2, Eye, EyeOff, ShieldCheck, ArrowLeft } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
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
      await api.post('/auth/login', {
        email: data.email.trim().toLowerCase(),
        password: data.password,
      });
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
        backgroundColor: 'var(--bg)',
        color: 'var(--fg)',
        padding: '1.5rem',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: '100%', maxWidth: '420px' }}
      >
        {/* Double-Bezel High-Craft Card */}
        <div
          className="bezel-card"
          style={{
            padding: '6px',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.18), 0 0 0 1px var(--border)',
          }}
        >
          <div
            className="bezel-core"
            style={{
              padding: '2.25rem 2rem',
              borderRadius: '18px',
              backgroundColor: 'var(--bg-surface)',
            }}
          >
            {/* Header / Brand Badge */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  backgroundColor: 'var(--accent-subtle)',
                  color: 'var(--accent)',
                  border: '1px solid var(--accent-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                  boxShadow: '0 4px 14px -2px var(--accent-subtle)',
                }}
              >
                <ShieldCheck size={26} strokeWidth={2} />
              </div>

              <h1
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  color: 'var(--fg)',
                  letterSpacing: '-0.03em',
                  marginBottom: '0.35rem',
                }}
              >
                CMS Sign In
              </h1>
              <p
                style={{
                  color: 'var(--fg-muted)',
                  fontSize: '0.875rem',
                  margin: 0,
                  lineHeight: 1.4,
                }}
              >
                Manage your portfolio content & analytics
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                {/* Email Address */}
                <div>
                  <label
                    htmlFor="admin-email"
                    style={{
                      display: 'block',
                      fontSize: '0.825rem',
                      fontWeight: 650,
                      color: 'var(--fg)',
                      marginBottom: '0.45rem',
                    }}
                  >
                    Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail
                      size={16}
                      strokeWidth={1.8}
                      style={{
                        position: 'absolute',
                        left: '0.95rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--fg-muted)',
                        pointerEvents: 'none',
                      }}
                    />
                    <input
                      id="admin-email"
                      type="email"
                      autoComplete="email"
                      {...register('email')}
                      className="login-input"
                      placeholder="admin@example.com"
                      aria-invalid={!!errors.email}
                      style={{
                        width: '100%',
                        height: '44px',
                        paddingLeft: '2.6rem',
                        paddingRight: '1rem',
                        borderRadius: '12px',
                        border: errors.email ? '1px solid #ef4444' : '1px solid var(--border)',
                        backgroundColor: 'var(--bg-elevated)',
                        color: 'var(--fg)',
                        fontSize: '0.875rem',
                        outline: 'none',
                        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                      }}
                    />
                  </div>
                  {errors.email && (
                    <p role="alert" style={{ color: '#ef4444', fontSize: '0.785rem', marginTop: '0.35rem', fontWeight: 500 }}>
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="admin-password"
                    style={{
                      display: 'block',
                      fontSize: '0.825rem',
                      fontWeight: 650,
                      color: 'var(--fg)',
                      marginBottom: '0.45rem',
                    }}
                  >
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock
                      size={16}
                      strokeWidth={1.8}
                      style={{
                        position: 'absolute',
                        left: '0.95rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--fg-muted)',
                        pointerEvents: 'none',
                      }}
                    />
                    <input
                      id="admin-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      {...register('password')}
                      className="login-input"
                      placeholder="••••••••"
                      aria-invalid={!!errors.password}
                      style={{
                        width: '100%',
                        height: '44px',
                        paddingLeft: '2.6rem',
                        paddingRight: '2.75rem',
                        borderRadius: '12px',
                        border: errors.password ? '1px solid #ef4444' : '1px solid var(--border)',
                        backgroundColor: 'var(--bg-elevated)',
                        color: 'var(--fg)',
                        fontSize: '0.875rem',
                        outline: 'none',
                        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '0.85rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--fg-muted)',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={16} strokeWidth={1.8} /> : <Eye size={16} strokeWidth={1.8} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p role="alert" style={{ color: '#ef4444', fontSize: '0.785rem', marginTop: '0.35rem', fontWeight: 500 }}>
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    height: '46px',
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    marginTop: '0.5rem',
                    opacity: isSubmitting ? 0.8 : 1,
                    gap: '0.5rem',
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <LogIn size={16} strokeWidth={2} />
                      <span>Sign In</span>
                    </>
                  )}
                </button>

              </div>
            </form>

          </div>
        </div>
      </motion.div>

      <style>{`
        .login-input:focus {
          border-color: var(--accent) !important;
          box-shadow: 0 0 0 3px var(--accent-subtle) !important;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
