


import { useEffect, useState } from "react";

import Lottie from "lottie-react";

interface HeroLottieProps {
  src?: string;
  className?: string;
}

/**
 * Loads a Lottie animation from a remote URL and renders it.
 * Default URL points to a career / education themed animation on LottieFiles.
 * You can replace `src` with any public Lottie JSON URL.
 */
export function HeroLottie({
  src = "https://lottie.host/4db68bbd-31f6-4cd8-84eb-189de081159a/IGmMCqhzpt.json",
  className = "",
}: HeroLottieProps) {
  const [data, setData] = useState<unknown>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(src)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [src]);

  if (failed || !data) {
    // Fallback placeholder while loading or on error
    return (
      <div
        className={`relative aspect-square w-full max-w-[420px] mx-auto ${className}`}
        aria-hidden
      >
        <div className="absolute inset-0 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute inset-8 rounded-full bg-primary/5 blur-2xl" />
      </div>
    );
  }

  return (
    <div className={`w-full max-w-[460px] mx-auto ${className}`}>
      <Lottie animationData={data} loop autoplay />
    </div>
  );
}
