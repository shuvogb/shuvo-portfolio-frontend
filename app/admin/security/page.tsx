'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Shield, Smartphone, XCircle, LogOut } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

interface SessionItem {
  _id: string;
  userAgent: string;
  ip: string;
  deviceType?: string;
  browser?: string;
  os?: string;
  createdAt: string;
  lastUsedAt: string;
}

export default function AdminSecurityPage() {
  const qc = useQueryClient();

  const { data: sessions = [], isLoading } = useQuery<SessionItem[]>({
    queryKey: ['admin-sessions'],
    queryFn: async () => {
      const res = await api.get('/auth/sessions');
      return res.data.data;
    },
  });

  const revokeSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => api.delete(`/auth/sessions/${sessionId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-sessions'] });
      toast.success('Session terminated');
    },
    onError: () => {
      toast.error('Failed to revoke session');
    },
  });

  const revokeAllOthersMutation = useMutation({
    mutationFn: async () => api.post('/auth/sessions/revoke-all-other'),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-sessions'] });
      toast.success('All other sessions terminated');
    },
    onError: () => {
      toast.error('Failed to revoke other sessions');
    },
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>
            Security & Active Sessions
          </h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>
            Track active logged-in devices and revoke sessions remotely.
          </p>
        </div>

        {sessions.length > 1 && (
          <button
            onClick={() => revokeAllOthersMutation.mutate()}
            disabled={revokeAllOthersMutation.isPending}
            className="btn btn-secondary"
            style={{ fontSize: '0.85rem' }}
          >
            <LogOut size={14} /> Revoke Other Devices
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Security Info Card */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: 'var(--primary-subtle)', borderColor: 'var(--primary-border)' }}>
          <Shield size={24} style={{ color: 'var(--primary)', flexShrink: 0 }} />
          <div>
            <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary)' }}>
              JWT Refresh Token Rotation & HttpOnly Cookies Enabled
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', marginTop: '0.15rem' }}>
              Your authentication session is protected with SameSite cookies, automatic refresh token rotation, and fingerprint validation.
            </p>
          </div>
        </div>

        {/* Sessions list */}
        <div className="card">
          <h2 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>
            Active Devices ({sessions.length})
          </h2>

          {isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: '72px' }} />
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {sessions.map((sess, idx) => (
                <div
                  key={sess._id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--muted)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '36px', height: '36px',
                      borderRadius: 'var(--radius)',
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Smartphone size={16} style={{ color: 'var(--primary)' }} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                          {sess.browser || 'Browser'} on {sess.os || 'OS'}
                        </span>
                        {idx === 0 && (
                          <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                            Current Session
                          </span>
                        )}
                      </div>
                      <p className="mono" style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginTop: '0.2rem' }}>
                        IP: {sess.ip || 'Unknown'} · Created: {new Date(sess.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {idx !== 0 && (
                    <button
                      onClick={() => revokeSessionMutation.mutate(sess._id)}
                      disabled={revokeSessionMutation.isPending}
                      className="btn btn-secondary"
                      style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', color: '#ef4444' }}
                    >
                      <XCircle size={13} /> Revoke
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
