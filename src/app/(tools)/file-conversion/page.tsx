
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FileConversionRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/file-conversion/zip');
  }, [router]);

  return null;
}
