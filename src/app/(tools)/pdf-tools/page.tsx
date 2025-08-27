
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PdfToolsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/pdf-tools/merge');
  }, [router]);

  return null;
}
