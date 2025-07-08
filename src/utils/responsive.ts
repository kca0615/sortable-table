import { useState, useEffect } from "react";

// Breakpoint definitions matching our CSS
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;

/**
 * Hook to detect current screen size and breakpoint
 */
export function useBreakpoint() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowSize.width < breakpoints.sm;
  const isTablet =
    windowSize.width >= breakpoints.sm && windowSize.width < breakpoints.lg;
  const isDesktop = windowSize.width >= breakpoints.lg;

  const isAbove = (breakpoint: Breakpoint) =>
    windowSize.width >= breakpoints[breakpoint];
  const isBelow = (breakpoint: Breakpoint) =>
    windowSize.width < breakpoints[breakpoint];

  return {
    width: windowSize.width,
    height: windowSize.height,
    isMobile,
    isTablet,
    isDesktop,
    isAbove,
    isBelow,
  };
}

/**
 * Hook to detect if we should show mobile layout
 */
export function useMobileLayout() {
  const { isBelow } = useBreakpoint();
  return isBelow("sm");
}

/**
 * Utility function to get responsive classes
 */
export function getResponsiveClasses(
  base: string,
  sm?: string,
  md?: string,
  lg?: string,
  xl?: string,
): string {
  const classes = [base];

  if (sm) classes.push(`sm:${sm}`);
  if (md) classes.push(`md:${md}`);
  if (lg) classes.push(`lg:${lg}`);
  if (xl) classes.push(`xl:${xl}`);

  return classes.join(" ");
}
