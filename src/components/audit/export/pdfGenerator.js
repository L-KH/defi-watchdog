// PDF Generator using browser print functionality
import { generateHTML } from './htmlGenerator';

export const generatePDF = async (report, contractName) => {
  try {
    // Generate HTML content
    const htmlContent = generateHTML(report);
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    if (!printWindow) {
      throw new Error('Please allow pop-ups to generate PDF');
    }
    
    // Write the HTML content with print-specific styles
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${contractName} - Audit Pro Report</title>
        <style>
          @media print {
            body {
              margin: 0;
              padding: 20px;
              font-family: Arial, sans-serif;
            }
            
            .no-print {
              display: none !important;
            }
            
            .page-break {
              page-break-after: always;
            }
            
            h1, h2, h3 {
              page-break-after: avoid;
            }
            
            .finding-item {
              page-break-inside: avoid;
            }
            
            @page {
              margin: 1cm;
              size: A4;
            }
          }
        </style>
      </head>
      <body>
        ${htmlContent}
        <script>
          // Auto-trigger print dialog
          window.onload = function() {
            window.print();
            // Close the window after printing
            window.onafterprint = function() {
              window.close();
            };
          };
        </script>
      </body>
      </html>
    `);
    
    printWindow.document.close();
    
  } catch (error) {
    console.error('PDF generation failed:', error);
    
    // Fallback: download HTML file that can be printed
    const htmlContent = generateHTML(report);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${contractName}_audit_report_${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('PDF generation failed. Downloaded HTML file instead. You can open it and print to PDF.');
  }
};
