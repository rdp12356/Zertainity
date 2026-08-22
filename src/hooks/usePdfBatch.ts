import { useCallback, useEffect, useRef, useState } from "react";

import { useToast } from "@/hooks/use-toast";

/** How many PDFs render in parallel. Kept low to stay polite to the shared renderer. */
const BATCH_CONCURRENCY = 2;

export interface PdfBatchState {
  running: boolean;
  total: number;
  completed: number;
  failed: number;
  /** Ids whose PDF arrived as a real file download during the most recent batch. */
  doneIds: string[];
}

/**
 * Runs a queue of PDF generations with bounded parallelism, downloading each
 * file as soon as it is ready. Browsers may block programmatic downloads
 * beyond the first unless the site is granted "allow multiple downloads", so
 * workers return whether a file actually downloaded: only those ids land in
 * `doneIds`, and the summary copy asks users to check rather than asserting
 * success.
 */
export function usePdfBatch<T extends { id: string }>() {
  const { toast } = useToast();
  const [state, setState] = useState<PdfBatchState>({
    running: false,
    total: 0,
    completed: 0,
    failed: 0,
    doneIds: [],
  });
  const mountedRef = useRef(true);
  // Ref mirror of `running` so double invocation is rejected synchronously,
  // mirroring the busyRef pattern in usePdfDownload.
  const runningRef = useRef(false);
  const cancelRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  /**
   * @param worker resolves `true` when a file download was delivered, `false`
   *   when generation ended another way (e.g. print-dialog fallback).
   */
  const start = useCallback(
    async (
      items: T[],
      worker: (item: T) => Promise<boolean>,
      describe?: (item: T) => string
    ): Promise<void> => {
      if (items.length === 0 || runningRef.current) return;

      runningRef.current = true;
      cancelRef.current = false;
      setState({
        running: true,
        total: items.length,
        completed: 0,
        failed: 0,
        doneIds: [],
      });

      let cursor = 0;
      let completed = 0;
      let failed = 0;
      const doneIds: string[] = [];

      const runNext = async (): Promise<void> => {
        while (cursor < items.length && !cancelRef.current) {
          const item = items[cursor++];
          try {
            const downloaded = await worker(item);
            if (downloaded) {
              completed += 1;
              doneIds.push(item.id);
              if (mountedRef.current) {
                setState((s) => ({ ...s, completed, doneIds: [...doneIds] }));
              }
            }
          } catch (error) {
            failed += 1;
            console.error(`Batch PDF failed for "${describe?.(item) ?? item.id}":`, error);
            if (mountedRef.current) {
              setState((s) => ({ ...s, failed }));
            }
          }
        }
      };

      await Promise.all(
        Array.from({ length: Math.min(BATCH_CONCURRENCY, items.length) }, () => runNext())
      );

      const cancelled = cancelRef.current;
      runningRef.current = false;

      if (mountedRef.current) {
        setState({
          running: false,
          total: items.length,
          completed,
          failed,
          doneIds,
        });
        if (cancelled) {
          toast({
            title: "Batch cancelled",
            description: `${completed} of ${items.length} reports were downloaded.`,
          });
        } else if (failed > 0) {
          toast({
            title: "Batch finished with failures",
            description: `${completed} of ${items.length} reports downloaded. You can retry the rest from their rows.`,
            variant: "destructive",
          });
        } else {
          toast({
            title: "PDFs ready",
            description: `Processed ${completed} report${completed === 1 ? "" : "s"} — check your downloads folder. Missing any? Allow multiple downloads if your browser asked.`,
          });
        }
      }
    },
    [toast]
  );

  /** Stops picking up new items; in-flight generations finish naturally. */
  const cancel = useCallback(() => {
    cancelRef.current = true;
  }, []);

  return { ...state, start, cancel };
}
