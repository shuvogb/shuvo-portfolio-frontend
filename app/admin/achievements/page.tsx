'use client';

import { z } from 'zod';
import { AdminCrudPage, FieldConfig } from '@/components/admin/AdminCrudPage';

const achievementSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  order: z.coerce.number().default(0),
});

type AchievementForm = z.infer<typeof achievementSchema>;

const fields: FieldConfig[] = [
  { name: 'description', label: 'Achievement Description', type: 'textarea', placeholder: 'e.g. Organized 20+ social awareness campaigns...', required: true, rows: 3 },
  { name: 'order', label: 'Display Order', type: 'number', placeholder: '0' },
];

export default function AdminAchievementsPage() {
  return (
    <AdminCrudPage<AchievementForm>
      title="Achievements"
      apiPath="achievements"
      queryKey="admin-achievements"
      schema={achievementSchema}
      fields={fields}
      renderRow={(ach) => (
        <p style={{ fontSize: '0.9rem', color: 'var(--color-ink)' }} className="dark-text">
          {ach.description}
        </p>
      )}
    />
  );
}
