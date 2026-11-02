"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SponsorsPage() {
  const router = useRouter();

  useEffect(() => {
    // Sponsors section is hidden; redirecting to the gallery & coordinators section
    router.replace("/gallery");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#04060C] text-slate-100 flex items-center justify-center p-4">
      <div className="text-center font-mono-code text-xs text-slate-400">
        REDIRECTING TO GALLERY...
      </div>
    </div>
  );
}
