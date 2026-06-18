import { providers } from '@/lib/data';
import ProviderDetailClient from './ProviderDetailClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return providers.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  if (slug.startsWith('db-') || slug.match(/-\d+$/) || /^\d+$/.test(slug)) {
    return {
      title: 'Uzman Profili | HizmetBul',
      description: 'Hizmet veren uzman profili ve müşteri değerlendirmeleri.',
    };
  }
  const provider = providers.find(p => p.slug === slug);
  if (!provider) return {};
  return {
    title: `${provider.name} — ${provider.category} | HizmetBul`,
    description: provider.description,
  };
}

export default async function ProviderDetailPage({ params }: PageProps) {
  const { slug } = await params;
  return <ProviderDetailClient slug={slug} />;
}
