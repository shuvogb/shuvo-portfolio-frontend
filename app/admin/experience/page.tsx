'use client';

import { z } from 'zod';
import { AdminCrudPage, FieldConfig } from '@/components/admin/AdminCrudPage';

const experienceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  organization: z.string().min(1, 'Organization is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  isCurrent: z.boolean().default(false),
  bullets: z.preprocess((val) => {
    if (typeof val === 'string') {
      return val.split('\n').map((s) => s.trim()).filter(Boolean);
    }
    return val;
  }, z.array(z.string()).default([])),
  order: z.coerce.number().default(0),
});

type ExperienceForm = z.infer<typeof experienceSchema>;

const fields: FieldConfig[] = [
  { name: 'title', label: 'Job / Role Title', type: 'text', placeholder: 'e.g. Guest Relations Intern', required: true },
  { name: 'organization', label: 'Organization / Institution', type: 'text', placeholder: 'e.g. Best Western Plus Maya', required: true },
  { name: 'startDate', label: 'Start Date', type: 'text', placeholder: 'e.g. 2024-06 or June 2024', required: true },
  { name: 'endDate', label: 'End Date', type: 'text', placeholder: 'e.g. 2024-12 or leave blank if current' },
  { name: 'isCurrent', label: 'Is this your current role?', type: 'checkbox' },
  { name: 'bullets', label: 'Key Responsibilities / Achievements (one per line)', type: 'textarea', placeholder: 'Conducted interviews...\nManaged dataset...', rows: 4 },
  { name: 'order', label: 'Display Order', type: 'number', placeholder: '0' },
];

export default function AdminExperiencePage() {
  return (
    <AdminCrudPage<ExperienceForm>
      title="Experience"
      apiPath="experience"
      queryKey="admin-experience"
      schema={experienceSchema}
      fields={fields}
      renderRow={(exp) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{exp.title}</span>
            {exp.isCurrent && <span className="badge badge-sage" style={{ fontSize: '0.7rem' }}>Current</span>}
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-clay)', fontWeight: 500 }}>{exp.organization}</p>
          <p className="mono" style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginTop: '0.2rem' }}>
            {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate || 'N/A'} · {exp.bullets?.length || 0} bullets
          </p>
        </div>
      )}
    />
  );
}
