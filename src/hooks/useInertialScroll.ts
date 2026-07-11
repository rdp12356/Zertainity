import { useEffect, useRef } from "react";

/**
 * A custom, zero-dependency inertial smooth scrolling hook.
 * Captures native scroll behaviors and applies a interpolated (LERP) translate3d transform
 * to a viewport wrapper container. Rounds the translation values to prevent any sub-pixel rendering blur.
 */
export const useInertialScroll = (
  contentRef: React.RefObject<HTMLDivElement>,
  lerpFactor: number = 0.075
) => {
  const scrollData = useRef({
    current: 0,
    target: 0,
  });

  useEffect(() => {
    const contentElement = contentRef.current;
    if (!contentElement) return;

    // Responsive short-circuit: Bypass smooth scrolling on touch screens or when reduced motion is preferred
    const isTouchDevice = 
      typeof window !== "undefined" && 
      (window.matchMedia("(pointer: coarse)").matches || 
       "ontouchstart" in window || 
       navigator.maxTouchPoints > 0);
    const prefersReducedMotion = 
      typeof window !== "undefined" && 
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isTouchDevice || prefersReducedMotion) {
      return;
    }

    // Create a virtual scroll spacer to preserve browser default scrolling behavior
    const bodyHeightSpacer = document.createElement("div");
    bodyHeightSpacer.className = "z-scroll-spacer";
    bodyHeightSpacer.style.position = "absolute";
    bodyHeightSpacer.style.top = "0";
    bodyHeightSpacer.style.left = "0";
    bodyHeightSpacer.style.width = "1px";
    bodyHeightSpacer.style.pointerEvents = "none";
    document.body.appendChild(bodyHeightSpacer);

    // Apply fixed viewport styling to translate content layer smoothly
    contentElement.style.position = "fixed";
    contentElement.style.top = "0";
    contentElement.style.left = "0";
    contentElement.style.width = "100%";
    contentElement.style.willChange = "transform";
    
    // Hardware acceleration optimization and anti-blur parameter overrides
    contentElement.style.transformStyle = "preserve-3d";
    contentElement.style.backfaceVisibility = "hidden";
    contentElement.style.transform = "translate3d(0, 0, 0)";

    // Force sub-pixel rendering smoothing across browsers
    contentElement.style.setProperty("-webkit-font-smoothing", "antialiased");
    contentElement.style.setProperty("-moz-osx-font-smoothing", "grayscale");

    const updateHeight = () => {
      if (!contentElement) return;
      const height = contentElement.getBoundingClientRect().height;
      bodyHeightSpacer.style.height = `${height}px`;
    };

    // Track initial height and updates via ResizeObserver
    updateHeight();
    const resizeObserver = new ResizeObserver(() => {
      updateHeight();
    });
    resizeObserver.observe(contentElement);

    let lastTime = performance.now();
    let animationFrameId: number;

    const smoothScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      scrollData.current.target = scrollY;

      const now = performance.now();
      // Normalize delta time relative to a standard 60fps frame duration (~16.667ms)
      // Cap delta to prevent massive jumps when switching tabs
      const delta = Math.min((now - lastTime) / 16.667, 3);
      lastTime = now;

      // Frame-rate independent LERP coefficient: 1 - (1 - lerpFactor)^delta
      const adjustedLerp = 1 - Math.pow(1 - lerpFactor, delta);

      let nextY =
        scrollData.current.current +
        (scrollData.current.target - scrollData.current.current) * adjustedLerp;

      // Snap to target if proximity is sub-pixel to save processing
      if (Math.abs(scrollData.current.target - nextY) < 0.05) {
        nextY = scrollData.current.target;
      }

      scrollData.current.current = nextY;

      // Round translation values to avoid browser sub-pixel sub-rendering layout blurs
      const roundedY = Math.round(nextY);
      contentElement.style.transform = `translate3d(0, ${-roundedY}px, 0)`;

      animationFrameId = requestAnimationFrame(smoothScroll);
    };

    animationFrameId = requestAnimationFrame(smoothScroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (document.body.contains(bodyHeightSpacer)) {
        document.body.removeChild(bodyHeightSpacer);
      }

      // Restore elements back to original states on unmount
      if (contentElement) {
        contentElement.style.position = "";
        contentElement.style.top = "";
        contentElement.style.left = "";
        contentElement.style.width = "";
        contentElement.style.willChange = "";
        contentElement.style.transform = "";
        contentElement.style.transformStyle = "";
        contentElement.style.backfaceVisibility = "";
        contentElement.style.removeProperty("-webkit-font-smoothing");
        contentElement.style.removeProperty("-moz-osx-font-smoothing");
      }
    };
  }, [contentRef, lerpFactor]);
};
export default useInertialScroll;
