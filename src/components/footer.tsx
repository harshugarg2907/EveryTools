"use client";

import { useEffect, useState } from "react";

export function Footer() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const year = new Date().getFullYear();

  return (
    <footer className="text-center py-6 border-t">
      <p className="text-muted-foreground">&copy; {year} EvryTools. All rights reserved.</p>
    </footer>
  );
}
