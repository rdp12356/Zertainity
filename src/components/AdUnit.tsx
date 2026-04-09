import { useEffect } from "react";

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
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  return (
    <div className={`ad-container my-12 overflow-hidden flex justify-center w-full ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", minWidth: "250px" }}
        data-ad-client="ca-pub-0000000000000000"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
        {...(type === "in-article" ? { "data-ad-layout": "in-article" } : {})}
      />
    </div>
  );
};
