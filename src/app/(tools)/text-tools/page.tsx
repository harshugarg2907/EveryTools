
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TextToolsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/text-tools/word-counter');
  }, [router]);

  return null;
}
