'use client';

import { z } from 'zod';
import { AdminCrudPage, FieldConfig } from '@/components/admin/AdminCrudPage';

const publicationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  authors: z.preprocess((val) => {
    if (typeof val === 'string') {
      return val.split(',').map((s) => s.trim()).filter(Boolean);
    }
    return val;
  }, z.array(z.string()).min(1, 'At least one author is required')),
  source: z.string().min(1, 'Source / Journal is required'),
  year: z.coerce.number().min(1900).max(2100),
  volume: z.string().optional(),
  pages: z.string().optional(),
  link: z.string().url('Invalid URL').optional().or(z.literal('')),
  status: z.enum(['published', 'underReview', 'researchAssistant']),
  description: z.string().optional(),
  order: z.coerce.number().default(0),
});

type PublicationForm = z.infer<typeof publicationSchema>;

const fields: FieldConfig[] = [
  { name: 'title', label: 'Paper / Article Title', type: 'text', placeholder: 'e.g. A Social Research on...', required: true },
  { name: 'authors', label: 'Authors (comma separated)', type: 'text', placeholder: 'e.g. Shuvo Molla, Dr. Jane Doe', required: true },
  { name: 'source', label: 'Journal / Book / Conference', type: 'text', placeholder: 'e.g. Bangladesh Journal of Social Work', required: true },
  { name: 'year', label: 'Year', type: 'number', placeholder: '2024', required: true },
  { name: 'volume', label: 'Volume / Issue', type: 'text', placeholder: 'e.g. Vol. 12, Issue 3' },
  { name: 'pages', label: 'Page Range', type: 'text', placeholder: 'e.g. 45-60' },
  { name: 'link', label: 'URL / DOI Link', type: 'url', placeholder: 'https://doi.org/...' },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'published', label: 'Published' },
      { value: 'underReview', label: 'Under Review' },
      { value: 'researchAssistant', label: 'Research Assistant Work' },
    ],
    required: true,
  },
  { name: 'description', label: 'Short Description', type: 'textarea', placeholder: 'Methodology, findings, key contributions...', rows: 3 },
  { name: 'order', label: 'Display Order', type: 'number', placeholder: '0' },
];

export default function AdminPublicationsPage() {
  return (
    <AdminCrudPage<PublicationForm>
      title="Publications"
      apiPath="publications"
      queryKey="admin-publications"
      schema={publicationSchema}
      fields={fields}
      renderRow={(pub) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{pub.title}</span>
            <span className={`badge ${pub.status === 'published' ? 'badge-sage' : pub.status === 'underReview' ? 'badge-clay' : 'badge-sand'}`}>
              {pub.status}
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>
            {Array.isArray(pub.authors) ? pub.authors.join(', ') : pub.authors} · <span style={{ fontStyle: 'italic' }}>{pub.source}</span> ({pub.year})
          </p>
        </div>
      )}
    />
  );
}
