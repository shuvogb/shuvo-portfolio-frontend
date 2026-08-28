'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  GripVertical,
  AlertTriangle,
  Upload,
  Save,
  ImageIcon,
} from 'lucide-react';
import { useForm, FieldValues, Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ZodType } from 'zod';
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

export interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'number' | 'url' | 'checkbox' | 'image';
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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editItem, setEditItem] = useState<(T & { _id: string }) | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [pendingFiles, setPendingFiles] = useState<Record<string, File>>({});
  const [uploadingField, setUploadingField] = useState<string | null>(null);
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
    setValue,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<T>({ resolver: zodResolver(schema) });

  const openCreate = () => {
    setEditItem(null);
    setPendingFiles({});
    reset({} as T);
    setDrawerOpen(true);
  };

  const openEdit = (item: T & { _id: string }) => {
    setEditItem(item);
    setPendingFiles({});
    reset(item as unknown as T);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditItem(null);
    setPendingFiles({});
    reset({} as T);
  };

  const handleImageSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPendingFiles((prev) => ({ ...prev, [fieldName]: file }));
    const localUrl = URL.createObjectURL(file);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue(fieldName as Path<T>, localUrl as any, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
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
      closeDrawer();
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
    const updatedData = { ...data };

    for (const [fieldName, file] of Object.entries(pendingFiles)) {
      try {
        setUploadingField(fieldName);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('altText', `${title} asset`);

        const res = await api.post('/admin/media/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        (updatedData as Record<string, unknown>)[fieldName] = res.data.data.url;
      } catch {
        toast.error(`Failed to upload ${fieldName} to Cloudinary.`);
        setUploadingField(null);
        return;
      } finally {
        setUploadingField(null);
      }
    }

    await saveMutation.mutateAsync(updatedData);
    setPendingFiles({});
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--fg)', letterSpacing: '-0.03em', marginBottom: '0.35rem' }}>
            {title}
          </h1>
          <p style={{ color: 'var(--fg-muted)', fontSize: '0.9rem', margin: 0 }}>
            Manage and customize {title.toLowerCase()} displayed on the live portfolio.
          </p>
        </div>
        <button
          onClick={openCreate}
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
          aria-label={`Add new ${title}`}
        >
          <Plus size={16} /> Add {title.replace(/s$/, '')}
        </button>
      </div>

      {/* Items List */}
      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '64px', borderRadius: '12px' }} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="card bezel-card" style={{ textAlign: 'center', padding: '3.5rem 2rem', color: 'var(--fg-muted)' }}>
          <p style={{ marginBottom: '1.25rem', fontSize: '0.95rem' }}>{emptyMessage}</p>
          <button onClick={openCreate} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', margin: '0 auto' }}>
            <Plus size={16} /> Create First Entry
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {items.map((item) => (
            <div
              key={item._id}
              className="card bezel-card"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1.1rem 1.35rem',
                backgroundColor: 'var(--bg-surface)',
                transition: 'all 0.2s ease',
              }}
            >
              <GripVertical size={16} style={{ color: 'var(--fg-muted)', opacity: 0.45, flexShrink: 0 }} />
              
              <div style={{ flex: 1, minWidth: 0 }}>
                {renderRow(item)}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                <button
                  onClick={() => openEdit(item)}
                  className="btn btn-outline"
                  style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                  aria-label="Edit item"
                >
                  <Pencil size={13} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setDeleteId(item._id)}
                  className="btn btn-outline"
                  style={{ padding: '0.4rem 0.65rem', color: '#ef4444', borderColor: 'var(--border)' }}
                  aria-label="Delete item"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── Custom Slide-Over Edit Drawer ─────────────────────────────────── */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent width="max-w-2xl">
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', height: '100%' }} noValidate>
            
            <DrawerHeader>
              <DrawerTitle>{editItem ? 'Edit' : 'Create'} {title.replace(/s$/, '')}</DrawerTitle>
              <DrawerDescription>
                Fill in the details below to update this section on the portfolio.
              </DrawerDescription>
            </DrawerHeader>

            <DrawerBody>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {fields.map((field) => {
                  const currentValue = watch(field.name as Path<T>);
                  const pendingFile = pendingFiles[field.name];

                  return (
                    <div key={field.name} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label
                        htmlFor={`field-${field.name}`}
                        className="admin-label"
                      >
                        {field.label}
                        {field.required && <span style={{ color: 'var(--accent)', marginLeft: '0.25rem' }}>*</span>}
                      </label>

                      {field.type === 'textarea' ? (
                        <textarea
                          id={`field-${field.name}`}
                          {...register(field.name as Path<T>)}
                          onInput={(e) => {
                            const target = e.currentTarget;
                            target.style.height = 'auto';
                            target.style.height = `${Math.max(target.scrollHeight, 100)}px`;
                          }}
                          placeholder={field.placeholder}
                          className="admin-input"
                          style={{
                            height: 'auto',
                            minHeight: '100px',
                            overflow: 'hidden',
                            resize: 'none',
                            padding: '0.75rem 0.95rem',
                            lineHeight: 1.6,
                          }}
                        />
                      ) : field.type === 'select' ? (
                        <select
                          id={`field-${field.name}`}
                          {...register(field.name as Path<T>)}
                          className="admin-input"
                        >
                          {field.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      ) : field.type === 'checkbox' ? (
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', padding: '0.5rem 0' }}>
                          <input
                            id={`field-${field.name}`}
                            type="checkbox"
                            {...register(field.name as Path<T>)}
                            style={{ width: '18px', height: '18px', accentColor: 'var(--accent)' }}
                          />
                          <span style={{ fontSize: '0.875rem', color: 'var(--fg)' }}>Active / Enabled</span>
                        </label>
                      ) : field.type === 'image' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            {currentValue ? (
                              <img
                                src={String(currentValue)}
                                alt="Preview"
                                style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover', border: '1px solid var(--border)' }}
                              />
                            ) : (
                              <div style={{ width: '60px', height: '60px', borderRadius: '12px', backgroundColor: 'var(--bg-elevated)', border: '1px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fg-muted)' }}>
                                <ImageIcon size={20} />
                              </div>
                            )}

                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                              <input
                                id={`field-${field.name}`}
                                type="text"
                                {...register(field.name as Path<T>)}
                                placeholder={field.placeholder || 'https://res.cloudinary.com/...'}
                                className="admin-input"
                              />

                              <label
                                className="btn btn-outline"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.4rem',
                                  padding: '0.35rem 0.75rem',
                                  fontSize: '0.75rem',
                                  width: 'fit-content',
                                  cursor: 'pointer',
                                }}
                              >
                                <Upload size={13} />
                                <span>{pendingFile ? `Selected: ${pendingFile.name}` : 'Choose Image'}</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleImageSelect(e, field.name)}
                                  style={{ display: 'none' }}
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <input
                          id={`field-${field.name}`}
                          type={field.type}
                          {...register(field.name as Path<T>)}
                          placeholder={field.placeholder}
                          className="admin-input"
                        />
                      )}

                      {errors[field.name as keyof typeof errors] && (
                        <p role="alert" style={{ color: '#ef4444', fontSize: '0.75rem', margin: '0.15rem 0 0' }}>
                          {String((errors[field.name as keyof typeof errors] as { message?: string })?.message || 'Invalid value')}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </DrawerBody>

            <DrawerFooter>
              <button
                type="button"
                onClick={closeDrawer}
                className="btn btn-outline"
                style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem', borderRadius: '10px' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isDirty || isSubmitting || saveMutation.isPending || !!uploadingField}
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
                {isSubmitting || saveMutation.isPending || !!uploadingField ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>{uploadingField ? 'Uploading Image...' : 'Saving...'}</span>
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    <span>Save {title.replace(/s$/, '')}</span>
                  </>
                )}
              </button>
            </DrawerFooter>

          </form>
        </DrawerContent>
      </Drawer>

      {/* ─── Delete Confirmation Modal ────────────────────────────────────── */}
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
                Are you sure you want to delete this record? This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <button onClick={() => setDeleteId(null)} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                  Cancel
                </button>
                <button
                  onClick={() => deleteMutation.mutate(deleteId!)}
                  disabled={deleteMutation.isPending}
                  className="btn btn-primary"
                  style={{ backgroundColor: '#ef4444', borderColor: '#ef4444', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  {deleteMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  <span>Delete Record</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
