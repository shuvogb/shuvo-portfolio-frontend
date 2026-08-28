'use client';

import { z } from 'zod';
import { AdminCrudPage, FieldConfig } from '@/components/admin/AdminCrudPage';

const workshopSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  organizer: z.string().min(1, 'Organizer is required'),
  year: z.coerce.number().min(1900).max(2100),
  order: z.coerce.number().default(0),
});

type WorkshopForm = z.infer<typeof workshopSchema>;

const fields: FieldConfig[] = [
  { name: 'title', label: 'Workshop / Training Title', type: 'text', placeholder: 'e.g. Workshop on Qualitative Research Methods', required: true },
  { name: 'organizer', label: 'Organizing Body', type: 'text', placeholder: 'e.g. University of Dhaka', required: true },
  { name: 'year', label: 'Year', type: 'number', placeholder: '2023', required: true },
  { name: 'order', label: 'Display Order', type: 'number', placeholder: '0' },
];

export default function AdminWorkshopsPage() {
  return (
    <AdminCrudPage<WorkshopForm>
      title="Workshops & Training"
      apiPath="workshops"
      queryKey="admin-workshops"
      schema={workshopSchema}
      fields={fields}
      renderRow={(ws) => (
        <div>
          <p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.2rem' }}>{ws.title}</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-sage)' }}>
            {ws.organizer} · <span className="mono" style={{ color: 'var(--color-muted)' }}>{ws.year}</span>
          </p>
        </div>
      )}
    />
  );
}
