'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Pencil, Trash2, X, Loader2, GripVertical, AlertTriangle } from 'lucide-react';
import { useForm, FieldValues, Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ZodType } from 'zod';
import api from '@/lib/api';
import { toast } from 'sonner';

export interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'number' | 'url' | 'checkbox';
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
  rows?: number;
}

interface AdminCrudPageProps<T extends FieldValues> {
  title: string;
  apiPath: string;
  queryKey: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: ZodType<any, any, any>;
  fields: FieldConfig[];
  renderRow: (item: T & { _id: string }) => React.ReactNode;
  emptyMessage?: string;
}

export function AdminCrudPage<T extends FieldValues>({
  title,
  apiPath,
  queryKey,
  schema,
  fields,
  renderRow,
  emptyMessage = 'No records found.',
}: AdminCrudPageProps<T>) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<(T & { _id: string }) | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const qc = useQueryClient();

  const { data: items = [], isLoading } = useQuery<(T & { _id: string })[]>({
    queryKey: [queryKey],
    queryFn: async () => {
      const res = await api.get(`/admin/${apiPath}`);
      return res.data.data;
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<T>({ resolver: zodResolver(schema) });

  const openCreate = () => {
    setEditItem(null);
    reset({} as T);
    setDialogOpen(true);
  };

  const openEdit = (item: T & { _id: string }) => {
    setEditItem(item);
    reset(item as unknown as T);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditItem(null);
    reset({} as T);
  };

  const saveMutation = useMutation({
    mutationFn: async (data: T) => {
      if (editItem) {
        return api.put(`/admin/${apiPath}/${editItem._id}`, data);
      }
      return api.post(`/admin/${apiPath}`, data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [queryKey] });
      qc.invalidateQueries({ queryKey: ['portfolio'] });
      toast.success(editItem ? 'Updated successfully' : 'Created successfully');
      closeDialog();
    },
    onError: () => {
      toast.error('Operation failed. Please try again.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/admin/${apiPath}/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [queryKey] });
      qc.invalidateQueries({ queryKey: ['portfolio'] });
      toast.success('Deleted successfully');
      setDeleteId(null);
    },
    onError: () => {
      toast.error('Delete failed. Please try again.');
    },
  });

  const onSubmit = async (data: T) => {
    await saveMutation.mutateAsync(data);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.15rem' }}>
            {title}
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>
            Manage and reorder {title.toLowerCase()}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="btn btn-primary"
          aria-label={`Add new ${title}`}
        >
          <Plus size={16} /> Add Item
        </button>
      </div>

      {/* List */}
      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '64px' }} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem', color: 'var(--muted-foreground)' }}>
          <p style={{ marginBottom: '1rem' }}>{emptyMessage}</p>
          <button onClick={openCreate} className="btn btn-secondary">
            <Plus size={16} /> Create First Entry
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {items.map((item) => (
            <div
              key={item._id}
              className="card"
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem' }}
            >
              <GripVertical size={16} style={{ color: 'var(--muted-foreground)', flexShrink: 0, opacity: 0.5 }} aria-hidden="true" />
              <div style={{ flex: 1, minWidth: 0 }}>
                {renderRow(item)}
              </div>
              <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0 }}>
                <button
                  onClick={() => openEdit(item)}
                  aria-label="Edit item"
                  className="btn btn-secondary"
                  style={{ padding: '0.4rem 0.6rem' }}
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => setDeleteId(item._id)}
                  aria-label="Delete item"
                  className="btn btn-secondary"
                  style={{ padding: '0.4rem 0.6rem', color: '#ef4444' }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <AnimatePresence>
        {dialogOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDialog}
              style={{
                position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
                zIndex: 200,
              }}
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.15 }}
              role="dialog"
              aria-modal="true"
              aria-label={editItem ? 'Edit item' : 'Create item'}
              style={{
                position: 'fixed',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%', maxWidth: '520px',
                maxHeight: '90vh', overflowY: 'auto',
                zIndex: 201,
                backgroundColor: 'var(--card)',
                color: 'var(--card-foreground)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: '1.75rem',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '1.15rem' }}>
                  {editItem ? 'Edit' : 'Add'} {title.replace(/s$/, '')}
                </h2>
                <button
                  onClick={closeDialog}
                  aria-label="Close dialog"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground)', display: 'flex' }}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {fields.map((field) => (
                    <div key={field.name}>
                      <label
                        htmlFor={`field-${field.name}`}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}
                      >
                        {field.label}
                        {field.required && <span style={{ color: 'var(--primary)', fontSize: '0.75rem' }}>*</span>}
                      </label>

                      {field.type === 'textarea' ? (
                        <textarea
                          id={`field-${field.name}`}
                          {...register(field.name as Path<T>)}
                          rows={field.rows || 3}
                          placeholder={field.placeholder}
                          className="input"
                          style={{ resize: 'vertical' }}
                        />
                      ) : field.type === 'select' ? (
                        <select
                          id={`field-${field.name}`}
                          {...register(field.name as Path<T>)}
                          className="input"
                        >
                          {field.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      ) : field.type === 'checkbox' ? (
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                          <input
                            id={`field-${field.name}`}
                            type="checkbox"
                            {...register(field.name as Path<T>)}
                            style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                          />
                          <span style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>Yes</span>
                        </label>
                      ) : (
                        <input
                          id={`field-${field.name}`}
                          type={field.type}
                          {...register(field.name as Path<T>)}
                          placeholder={field.placeholder}
                          className="input"
                        />
                      )}

                      {errors[field.name as keyof typeof errors] && (
                        <p role="alert" style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                          {String((errors[field.name as keyof typeof errors] as { message?: string })?.message || 'Invalid')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                  <button type="button" onClick={closeDialog} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary"
                    style={{ opacity: isSubmitting ? 0.75 : 1 }}
                  >
                    {isSubmitting ? (
                      <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</>
                    ) : (
                      'Save Record'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteId && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDeleteId(null)}
              style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 200 }}
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
              role="alertdialog" aria-modal="true" aria-label="Confirm deletion"
              style={{
                position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                width: '100%', maxWidth: '360px', zIndex: 201,
                backgroundColor: 'var(--card)', color: 'var(--card-foreground)',
                border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                padding: '1.5rem', textAlign: 'center',
              }}
            >
              <AlertTriangle size={36} style={{ color: '#ef4444', margin: '0 auto 0.75rem' }} />
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>
                Confirm Deletion
              </h3>
              <p style={{ color: 'var(--muted-foreground)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                Are you sure you want to permanently delete this item?
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                <button onClick={() => setDeleteId(null)} className="btn btn-secondary">Cancel</button>
                <button
                  onClick={() => deleteMutation.mutate(deleteId!)}
                  disabled={deleteMutation.isPending}
                  className="btn btn-primary"
                  style={{ backgroundColor: '#ef4444' }}
                >
                  {deleteMutation.isPending ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={14} />}
                  Delete
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
