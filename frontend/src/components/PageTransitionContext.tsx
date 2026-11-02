"use client";

import React, { createContext, useContext, useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import SplashScreen from "./SplashScreen";

interface PageTransitionContextType {
  navigateTo: (url: string, label?: string) => void;
  isTransitioning: boolean;
}

const PageTransitionContext = createContext<PageTransitionContextType>({
  navigateTo: () => {},
  isTransitioning: false,
});

export const usePageTransition = () => useContext(PageTransitionContext);

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionLabel, setTransitionLabel] = useState<string | undefined>(undefined);
  const [isPending, startTransition] = useTransition();

  const navigateTo = (url: string, label?: string) => {
    // If already on the same page, do nothing
    if (url === pathname) return;

    // Direct navigation to /events so the dedicated EventsLoading golden spark vortex takes center stage
    if (url === "/events") {
      startTransition(() => {
        router.push(url);
      });
      return;
    }

    setTransitionLabel(label);
    setIsTransitioning(true);

    // Fast speed transition (~650ms) without loading bar, exactly as requested
    setTimeout(() => {
      startTransition(() => {
        router.push(url);
      });
      // Allow the new page to mount then finish transition
      setTimeout(() => {
        setIsTransitioning(false);
      }, 350);
    }, 600);
  };

  return (
    <PageTransitionContext.Provider value={{ navigateTo, isTransitioning }}>
      {/* Fast Flash Screen during page navigation (speedy, without loading bar) */}
      {isTransitioning && (
        <SplashScreen
          speedMs={550}
          showLoadingBar={false}
          subtitle={transitionLabel}
          onComplete={() => setIsTransitioning(false)}
        />
      )}
      {children}
    </PageTransitionContext.Provider>
  );
}
