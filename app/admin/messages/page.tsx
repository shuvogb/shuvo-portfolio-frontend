'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Mail, MailOpen, Trash2, MessageSquare } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

interface Message {
  _id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const qc = useQueryClient();

  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ['admin-messages'],
    queryFn: async () => {
      const res = await api.get('/admin/messages');
      return res.data.data;
    },
  });

  const markReadMutation = useMutation({
    mutationFn: async (id: string) => api.patch(`/admin/messages/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-messages'] });
      qc.invalidateQueries({ queryKey: ['analytics-overview'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/admin/messages/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-messages'] });
      qc.invalidateQueries({ queryKey: ['analytics-overview'] });
      toast.success('Message deleted');
    },
    onError: () => {
      toast.error('Failed to delete message');
    },
  });

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 style={{ fontSize: '1.75rem' }}>
              Messages
            </h1>
            {unreadCount > 0 && (
              <span className="badge badge-primary">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Inquiries submitted via the public contact form.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '100px' }} />
          ))}
        </div>
      ) : messages.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 2rem', color: 'var(--muted-foreground)' }}>
          <MessageSquare size={36} style={{ color: 'var(--muted-foreground)', margin: '0 auto 0.75rem', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.35rem', color: 'var(--foreground)' }}>
            No Messages
          </h3>
          <p style={{ fontSize: '0.85rem' }}>Inquiries from visitors will appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {messages.map((msg) => (
            <div
              key={msg._id}
              className="card"
              style={{
                borderLeft: msg.isRead ? '1px solid var(--border)' : '3px solid var(--primary)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                      {msg.name}
                    </span>
                    {!msg.isRead && (
                      <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                        New
                      </span>
                    )}
                  </div>
                  <a
                    href={`mailto:${msg.email}`}
                    style={{ fontSize: '0.85rem', color: 'var(--primary)', textDecoration: 'none' }}
                  >
                    {msg.email}
                  </a>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                    {new Date(msg.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {!msg.isRead && (
                    <button
                      onClick={() => markReadMutation.mutate(msg._id)}
                      className="btn btn-secondary"
                      style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
                    >
                      <MailOpen size={13} /> Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => deleteMutation.mutate(msg._id)}
                    className="btn btn-secondary"
                    style={{ padding: '0.35rem 0.6rem', color: '#ef4444' }}
                    aria-label="Delete message"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--foreground)', whiteSpace: 'pre-wrap' }}>
                {msg.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
