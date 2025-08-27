
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ImageToolsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/image-tools/convert');
  }, [router]);

  return null;
}
