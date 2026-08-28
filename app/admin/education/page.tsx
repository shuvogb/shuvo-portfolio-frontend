'use client';

import { z } from 'zod';
import { AdminCrudPage, FieldConfig } from '@/components/admin/AdminCrudPage';

const educationSchema = z.object({
  degree: z.string().min(1, 'Degree is required'),
  institution: z.string().min(1, 'Institution is required'),
  result: z.string().min(1, 'Result / GPA is required'),
  startDate: z.string().min(1, 'Start Date is required'),
  endDate: z.string().optional(),
  isCurrent: z.boolean().default(false),
  order: z.coerce.number().default(0),
});

type EducationForm = z.infer<typeof educationSchema>;

const fields: FieldConfig[] = [
  { name: 'degree', label: 'Degree / Certificate', type: 'text', placeholder: 'e.g. B.S.S. in Sociology', required: true },
  { name: 'institution', label: 'Institution / Board', type: 'text', placeholder: 'e.g. University of Barishal', required: true },
  { name: 'result', label: 'Result / CGPA / Division', type: 'text', placeholder: 'e.g. CGPA: 3.42 / 4.00', required: true },
  { name: 'startDate', label: 'Start Date / Year', type: 'text', placeholder: 'e.g. 2020', required: true },
  { name: 'endDate', label: 'End Date / Year', type: 'text', placeholder: 'e.g. 2024 or leave empty' },
  { name: 'isCurrent', label: 'Currently enrolled?', type: 'checkbox' },
  { name: 'order', label: 'Display Order', type: 'number', placeholder: '0' },
];

export default function AdminEducationPage() {
  return (
    <AdminCrudPage<EducationForm>
      title="Education"
      apiPath="education"
      queryKey="admin-education"
      schema={educationSchema}
      fields={fields}
      renderRow={(edu) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{edu.degree}</span>
            {edu.isCurrent && <span className="badge badge-sage" style={{ fontSize: '0.7rem' }}>Enrolled</span>}
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-clay)', fontWeight: 500 }}>{edu.institution}</p>
          <p className="mono" style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginTop: '0.2rem' }}>
            {edu.startDate} – {edu.isCurrent ? 'Present' : edu.endDate || 'N/A'} · Result: {edu.result}
          </p>
        </div>
      )}
    />
  );
}
