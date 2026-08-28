'use client';

import { z } from 'zod';
import { AdminCrudPage, FieldConfig } from '@/components/admin/AdminCrudPage';

const skillSchema = z.object({
  name: z.string().min(1, 'Skill name is required'),
  category: z.enum(['technical', 'professional']),
  order: z.coerce.number().default(0),
});

type SkillForm = z.infer<typeof skillSchema>;

const fields: FieldConfig[] = [
  { name: 'name', label: 'Skill Name', type: 'text', placeholder: 'e.g. SPSS / Data Analysis', required: true },
  {
    name: 'category',
    label: 'Category',
    type: 'select',
    options: [
      { value: 'technical', label: 'Technical' },
      { value: 'professional', label: 'Professional' },
    ],
    required: true,
  },
  { name: 'order', label: 'Display Order', type: 'number', placeholder: '0' },
];

export default function AdminSkillsPage() {
  return (
    <AdminCrudPage<SkillForm>
      title="Skills"
      apiPath="skills"
      queryKey="admin-skills"
      schema={skillSchema}
      fields={fields}
      renderRow={(skill) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>{skill.name}</span>
          <span className={`badge ${skill.category === 'technical' ? 'badge-clay' : 'badge-sage'}`}>
            {skill.category}
          </span>
          <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginLeft: 'auto' }}>
            #{skill.order}
          </span>
        </div>
      )}
    />
  );
}
