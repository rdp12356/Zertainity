import { toast } from "@/components/ui/use-toast";

/**
 * Client-side fallback PDF generator using native browser print.
 * This triggers the native browser print dialog (using Skia/PDF on Chromium)
 * which yields high-quality, vector-based, text-selectable PDFs.
 */
export async function generatePdfFallback(htmlContent: string, filename: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      toast({
        title: "Preparing Document...",
        description: "Opening print dialog. Please choose 'Save as PDF'.",
      });

      // Create a hidden iframe
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = 'none';
      
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentWindow?.document;
      
      if (!iframeDoc) {
        throw new Error("Could not access iframe document");
      }

      // We need to inject styles for the print view
      const printStyles = `
        <style>
          @media print {
            @page {
              size: A4 portrait;
              margin: 1.5cm;
            }
            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              font-family: system-ui, -apple-system, sans-serif;
              color: #111827;
              background: #ffffff;
            }
            .watermark { display: none !important; }
            .header-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .scores-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            .scores-table th { background: #f3f4f6 !important; color: #374151; font-weight: bold; border-bottom: 2px solid #e5e7eb; text-align: left; }
            .scores-table td { border-bottom: 1px solid #e5e7eb; padding: 8px 10px; }
            .rec { background: #f9fafb !important; border-left: 4px solid #0ea5e9 !important; padding: 12px; border-radius: 6px; margin-bottom: 12px; page-break-inside: avoid; }
            footer { margin-top: 30px; font-size: 10px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 10px; }
            
            /* Break pages properly */
            h1, h2, h3, h4, h5 { page-break-after: avoid; }
            table, figure { page-break-inside: avoid; }
          }
        </style>
      `;

      // Write content to iframe
      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${filename.replace('.pdf', '')}</title>
            ${printStyles}
          </head>
          <body>
            ${htmlContent}
          </body>
        </html>
      `);
      iframeDoc.close();

      // Wait for resources to load (images etc.) before printing
      iframe.onload = () => {
        setTimeout(() => {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
          
          // Cleanup after print dialog closes (or immediately after it opens in some browsers)
          setTimeout(() => {
            document.body.removeChild(iframe);
            resolve();
          }, 1000);
        }, 500); // Small delay to ensure rendering is complete
      };

    } catch (error) {
      console.error("Native print compilation failed:", error);
      toast({
        title: "Print failed",
        description: "Could not open print dialog.",
        variant: "destructive",
      });
      reject(error);
    }
  });
}
