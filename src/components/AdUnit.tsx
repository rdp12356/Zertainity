

import { useEffect, useRef } from "react";

interface AdUnitProps {
  type?: "display" | "in-feed" | "in-article";
  slot: string;
  format?: "auto" | "fluid";
  className?: string;
  "data-full-width-responsive"?: string;
}

export const AdUnit = ({
  type = "display",
  slot,
  format = "auto",
  className = "",
  "data-full-width-responsive": responsive = "true",
}: AdUnitProps) => {
  const client = import.meta.env.VITE_ADSENSE_CLIENT_ID?.trim();
  const isPlaceholder = slot === "1111111111" && (!client || !/^ca-pub-\d{10,20}$/i.test(client));
  const insRef = useRef<HTMLModElement>(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    if (isPlaceholder) return;
    if (pushedRef.current) return;
    const el = insRef.current;
    if (!el) return;
    // Skip if AdSense already filled this element (e.g. StrictMode re-mount)
    if (el.getAttribute("data-adsbygoogle-status")) return;
    try {
      // @ts-expect-error adsbygoogle is injected by AdSense script
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushedRef.current = true;
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, [isPlaceholder]);

  if (isPlaceholder) return null;

  return (
    <div className={`ad-container my-12 overflow-hidden flex justify-center w-full ${className}`}>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block", minWidth: "250px" }}
        data-ad-client={client || "ca-pub-0000000000000000"}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
        {...(type === "in-article" ? { "data-ad-layout": "in-article" } : {})}
      />
    </div>
  );
};
