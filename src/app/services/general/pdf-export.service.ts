import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';

export interface PdfColumn {
  header: string;
  width: number; // Percentage of available width (0-1)
}

export interface PdfExportOptions {
  title: string;
  columns: PdfColumn[];
  data: any[][];
  filename?: string;
  companyName?: string;
  mobileNumber?: string;
  orientation?: 'portrait' | 'landscape';
  pageSize?: 'a4' | 'letter';
}

@Injectable({
  providedIn: 'root',
})
export class PdfExportService {
  constructor() {}

  public exportToPdf(options: PdfExportOptions): void {
    const {
      title,
      columns,
      data,
      filename,
      companyName = 'ViscoBackery Sales Delivery Monitoring System',
      mobileNumber = '+94 (0) 123 456 789',
      orientation = 'landscape',
      pageSize = 'a4',
    } = options;

    const doc = new jsPDF(
      orientation === 'landscape' ? 'l' : 'p',
      'mm',
      pageSize
    );
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;
    let yPosition = margin;

    // Company Header
    const currentDate = new Date().toLocaleString();

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(companyName, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 7;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Mobile: ${mobileNumber}`, pageWidth / 2, yPosition, {
      align: 'center',
    });
    yPosition += 5;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Generated Date & Time: ${currentDate}`,
      pageWidth / 2,
      yPosition,
      {
        align: 'center',
      }
    );
    yPosition += 8;

    // Report Title
    if (title) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(title, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 6;
    }

    // Table configuration
    const availableWidth = pageWidth - margin * 2;
    const columnWidths = columns.map((col) => availableWidth * col.width);

    const cellPadding = 2;
    const lineHeight = 4;
    const headerHeight = 9;
    const footerMargin = 15;
    const tableStartX = margin;
    let currentPageNumber = 1;

    // Helper function to split text into lines
    const splitTextToLines = (text: string, maxWidth: number): string[] => {
      if (!text) return [''];

      const availableWidth = maxWidth - cellPadding * 2;
      const lines: string[] = [];
      const words = text.toString().split(' ');
      let currentLine = '';

      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const testLine = currentLine ? currentLine + ' ' + word : word;
        const lineWidth = doc.getTextWidth(testLine);

        if (lineWidth > availableWidth) {
          if (currentLine) {
            lines.push(currentLine);
            currentLine = word;
          } else {
            // Single word is too long, split the word itself
            let remainingWord = word;
            while (remainingWord.length > 0) {
              let chunk = '';
              for (let j = 0; j < remainingWord.length; j++) {
                const testChunk = chunk + remainingWord[j];
                if (doc.getTextWidth(testChunk) <= availableWidth) {
                  chunk = testChunk;
                } else {
                  break;
                }
              }
              if (chunk.length === 0) {
                chunk = remainingWord[0];
                remainingWord = remainingWord.substring(1);
              } else {
                remainingWord = remainingWord.substring(chunk.length);
              }
              lines.push(chunk);
            }
          }
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine) {
        lines.push(currentLine);
      }

      return lines.length > 0 ? lines : [''];
    };

    // Helper function to draw table header
    const drawTableHeader = () => {
      // Split header text into lines for each column
      const headerLines = columns.map((col, index) =>
        splitTextToLines(col.header, columnWidths[index])
      );

      // Calculate header height based on max lines in any column
      const maxHeaderLines = Math.max(...headerLines.map((lines) => lines.length));
      const calculatedHeaderHeight = Math.max(lineHeight * maxHeaderLines + cellPadding * 2, 9);

      // Draw backgrounds
      doc.setFillColor(41, 128, 185);
      let xPos = tableStartX;
      columns.forEach((col, index) => {
        doc.rect(xPos, yPosition, columnWidths[index], calculatedHeaderHeight, 'F');
        xPos += columnWidths[index];
      });

      // Draw borders
      doc.setDrawColor(30, 90, 150);
      doc.setLineWidth(0.5);
      xPos = tableStartX;
      columns.forEach((col, index) => {
        doc.rect(xPos, yPosition, columnWidths[index], calculatedHeaderHeight, 'S');
        xPos += columnWidths[index];
      });

      // Draw text
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      let xTextPos = tableStartX;
      headerLines.forEach((lines, index) => {
        let textY = yPosition + cellPadding + lineHeight - 1;
        lines.forEach((line) => {
          doc.text(line, xTextPos + cellPadding, textY);
          textY += lineHeight;
        });
        xTextPos += columnWidths[index];
      });

      yPosition += calculatedHeaderHeight;
    };

    // Draw initial header
    drawTableHeader();

    // Helper function to check and create new page if needed
    const checkPageBreak = (requiredHeight: number) => {
      if (yPosition + requiredHeight > pageHeight - footerMargin) {
        // Add footer
        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(120, 120, 120);
        doc.text(
          'This is a system generated report. © ViscoBackery',
          pageWidth / 2,
          pageHeight - 5,
          { align: 'center' }
        );
        doc.text(
          `Page ${currentPageNumber}`,
          pageWidth - margin,
          pageHeight - 5,
          { align: 'right' }
        );

        // Add new page
        doc.addPage();
        currentPageNumber++;
        yPosition = margin;

        // Redraw header on new page
        drawTableHeader();
      }
    };

    // Draw data rows
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);

    data.forEach((rowData, rowIndex) => {
      // Split text into lines for each cell
      const cellLines = rowData.map((value, index) =>
        splitTextToLines(value?.toString() || '', columnWidths[index])
      );

      // Calculate row height based on max lines in any cell
      const maxLines = Math.max(...cellLines.map((lines) => lines.length));
      const cellHeight = Math.max(lineHeight * maxLines + cellPadding * 2, 7);

      // Check if we need a new page
      checkPageBreak(cellHeight);

      // Draw alternate row background
      if (rowIndex % 2 === 1) {
        doc.setFillColor(245, 245, 245);
        let xPos = tableStartX;
        columnWidths.forEach((width) => {
          doc.rect(xPos, yPosition, width, cellHeight, 'F');
          xPos += width;
        });
      }

      // Draw cell borders
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.3);
      let xBorderPos = tableStartX;
      columnWidths.forEach((width) => {
        doc.rect(xBorderPos, yPosition, width, cellHeight, 'S');
        xBorderPos += width;
      });

      // Draw text in cells
      doc.setTextColor(0, 0, 0);
      let xTextPos = tableStartX;
      cellLines.forEach((lines, index) => {
        let textY = yPosition + cellPadding + lineHeight - 1;
        lines.forEach((line) => {
          doc.text(line, xTextPos + cellPadding, textY);
          textY += lineHeight;
        });
        xTextPos += columnWidths[index];
      });

      yPosition += cellHeight;
    });

    // Draw footer on last page
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(120, 120, 120);
    doc.text(
      'This is a system generated report. © ViscoBackery',
      pageWidth / 2,
      pageHeight - 5,
      { align: 'center' }
    );
    doc.text(
      `Page ${currentPageNumber}`,
      pageWidth - margin,
      pageHeight - 5,
      { align: 'right' }
    );

    // Generate filename with timestamp
    const finalFilename =
      filename ||
      `Report_${new Date().toISOString().slice(0, 10)}_${new Date().getTime()}.pdf`;

    doc.save(finalFilename);
  }
}
