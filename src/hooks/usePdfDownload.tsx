import { useCallback, useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";

import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";

/** Coarse progress stages surfaced to the user while a PDF is being produced. */
export type PdfStage = "preparing" | "rendering" | "saving";

const STAGE_LABELS: Record<PdfStage, string> = {
  preparing: "Preparing report...",
  rendering: "Rendering PDF...",
  saving: "Saving file...",
};

type PdfTask = (setStage: (stage: PdfStage) => void) => Promise<void>;

/**
 * Shared lifecycle for client-triggered PDF downloads:
 * - one busy state per page, so every trigger disables together;
 * - staged progress labels for the trigger buttons ("Rendering PDF...");
 * - a single success toast on completion;
 * - an error toast with a one-tap Retry that re-runs the exact failed attempt
 *   (no-op if the page has since been unmounted).
 */
export function usePdfDownload() {
  const { toast } = useToast();
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [stage, setStage] = useState<PdfStage>("preparing");
  // Ref mirror of the busy guard so concurrent invocations are rejected even
  // within the same render cycle; the rendered side reads `activeKey` instead.
  const busyRef = useRef(false);
  const mountedRef = useRef(true);
  // Latest stable handle to `downloadPdf`, so the retry action inside the
  // toast never closes over a stale memoized identity.
  const downloadPdfRef = useRef<(key: string, task: PdfTask) => Promise<boolean>>(
    async () => false
  );

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const downloadPdf = useCallback(
    async (key: string, task: PdfTask): Promise<boolean> => {
      if (busyRef.current) return false;
      busyRef.current = true;
      setActiveKey(key);
      setStage("preparing");
      try {
        await task(setStage);
        toast({
          title: "PDF downloaded",
          description: "Your assessment report has been generated.",
        });
        return true;
      } catch (error) {
        console.error(`PDF download failed (${key}):`, error);
        toast({
          title: "Download failed",
          description: "We couldn't generate your PDF just now.",
          variant: "destructive",
          action: (
            <ToastAction
              altText="Retry PDF download"
              className="gap-1.5"
              onClick={() => {
                if (mountedRef.current) void downloadPdfRef.current(key, task);
              }}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Retry
            </ToastAction>
          ),
        });
        return false;
      } finally {
        busyRef.current = false;
        setActiveKey(null);
        setStage("preparing");
      }
    },
    [toast]
  );

  useEffect(() => {
    downloadPdfRef.current = downloadPdf;
  }, [downloadPdf]);

  return {
    /** Key of the in-flight download, or null when idle. */
    activeKey,
    stage,
    stageLabel: STAGE_LABELS[stage],
    isBusy: activeKey !== null,
    downloadPdf,
  };
}
