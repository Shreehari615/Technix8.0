"use client";

import React from "react";
import { usePathname } from "next/navigation";

export default function SubpageBackground() {
  const pathname = usePathname();

  // Do NOT render on the Home page ("/") or Admin pages ("/admin")
  if (pathname === "/" || pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* Background image - full brightness, clearly visible */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/background.jpeg"
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          opacity: 0.55,
        }}
      />

      {/* Very light dark tint - just enough for text readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(4, 6, 12, 0.45)",
        }}
      />
    </div>
  );
}
