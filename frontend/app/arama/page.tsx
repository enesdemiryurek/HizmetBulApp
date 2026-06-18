export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { Suspense } from 'react';
import AramaContent from './AramaContent';
import PixarLoader from '@/components/PixarLoader';

export const metadata = {
  title: 'Hizmet Ara — HizmetBul',
  description: 'Kategoriye, şehre ve puana göre filtreleyerek güvenilir hizmet verenleri bulun.',
};

export default function AramaPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex flex-col pt-24 bg-gray-50 dark:bg-[#050505]">
          <PixarLoader fullScreen={false} />
        </div>
      }
    >
      <AramaContent />
    </Suspense>
  );
}
