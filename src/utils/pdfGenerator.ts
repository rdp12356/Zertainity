import { toast } from "@/components/ui/use-toast";

/**
 * Client-side fallback PDF generator.
 * Uses dynamic imports for jsPDF and html2canvas to optimize initial bundle size.
 */
export async function generatePdfFallback(htmlContent: string, filename: string): Promise<void> {
  try {
    toast({
      title: "Generating PDF...",
      description: "Compiling report client-side. Please wait a moment.",
    });

    // Dynamically import dependencies to save bundle size
    const { jsPDF } = await import("jspdf");
    const { default: html2canvas } = await import("html2canvas");

    // Create a temporary sandboxed container for rendering
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "-9999px";
    container.style.top = "-9999px";
    container.style.width = "794px"; // Standard A4 width at 96 DPI
    container.style.padding = "20px";
    container.style.boxSizing = "border-box";
    container.style.background = "#ffffff";
    container.style.color = "#111827";
    container.style.fontFamily = "system-ui, -apple-system, sans-serif";
    container.innerHTML = htmlContent;

    // Inject print-specific styling overrides to match WeasyPrint's styles
    const styleOverride = document.createElement("style");
    styleOverride.textContent = `
      body { background: #ffffff; color: #111827; }
      .watermark { display: none !important; }
      .header-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
      .scores-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
      .scores-table th { background: #f3f4f6; color: #374151; font-weight: bold; border-bottom: 2px solid #e5e7eb; }
      .scores-table td { border-bottom: 1px solid #e5e7eb; padding: 8px 10px; }
      .rec { background: #f9fafb; border-left: 4px solid #0ea5e9; padding: 12px; border-radius: 6px; margin-bottom: 12px; page-break-inside: avoid; }
      footer { margin-top: 30px; font-size: 10px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 10px; }
    `;
    container.appendChild(styleOverride);
    document.body.appendChild(container);

    // Wait for all images in the container to load completely
    const images = container.getElementsByTagName("img");
    await Promise.all(
      Array.from(images).map(
        (img) =>
          new Promise<void>((resolve) => {
            if (img.complete) {
              resolve();
            } else {
              img.onload = () => resolve();
              img.onerror = () => resolve();
            }
          })
      )
    );

    // Render HTML to a high-density canvas
    const canvas = await html2canvas(container, {
      scale: 2, // 2x scale for print sharpness
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      windowWidth: 794,
    });

    // Remove the temporary container
    document.body.removeChild(container);

    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    const pdf = new jsPDF("p", "pt", "a4");
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    // Standard A4 aspect ratio sizing
    const imgHeight = (canvasHeight * pdfWidth) / canvasWidth;
    let heightLeft = imgHeight;
    let position = 0;

    // Render the first page
    pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Generate subsequent pages if content overflows a single A4 page
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    // Save and download the PDF
    pdf.save(filename);
    
    toast({
      title: "PDF Saved",
      description: "Fallback client-side PDF generated and downloaded.",
    });
  } catch (error) {
    console.error("Client-side PDF compilation failed:", error);
    toast({
      title: "Compilation failed",
      description: "Could not generate PDF client-side.",
      variant: "destructive",
    });
  }
}
