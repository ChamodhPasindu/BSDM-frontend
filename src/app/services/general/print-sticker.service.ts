import { Injectable } from '@angular/core';
import { IProductData } from 'src/app/interfaces/IProductData';

export interface StickerData {
  itemName: string;
  batchCode: string;
  expiryDate: string;
  manufacturingDate: string;
}

@Injectable({
  providedIn: 'root',
})
export class PrintStickerService {
  private readonly STICKERS_PER_ROW = 6; // Extra-dense small-sticker grid
  private readonly STICKERS_PER_COL = 12; // Total: 72 stickers per A4 page (smaller height)

  constructor() {}

  /**
   * Generate sticker data from product
   */
  private generateStickerData(product: IProductData): StickerData {
    return {
      itemName: product.productName || '',
      batchCode: product.batchCode || '',
      expiryDate: this.formatDate(product.expiryDate),
      manufacturingDate: this.formatDate(product.manufactureDate),
    };
  }

  /**
   * Format date for display
   */
  private formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  /**
   * Print stickers in grid layout
   */
  public printStickers(product: IProductData, quantity: number): void {
    const stickerData = this.generateStickerData(product);
    const htmlContent = this.generateHTML(stickerData, quantity);

    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) {
      alert('Please allow pop-ups to print stickers');
      return;
    }

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Wait for content to load before printing
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }

  /**
   * Generate HTML for printing
   */
  private generateHTML(stickerData: StickerData, quantity: number): string {
    const stickers = this.generateStickerElements(stickerData, quantity);

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Print Stickers</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: Arial, sans-serif;
            background: white;
          }

          @media print {
            @page {
              size: A4;
              margin: 0;
            }

            html,
            body {
              width: 210mm;
              height: 297mm;
              margin: 0;
              padding: 0;
            }

            .page {
              page-break-after: always;
              margin: 0;
              padding: 0;
              page-break-inside: avoid;
            }

            .sticker {
              page-break-inside: avoid;
            }
          }

          .page {
            width: 210mm;
            height: 297mm;
            display: grid;
            grid-template-columns: repeat(${this.STICKERS_PER_ROW}, 1fr);
            grid-template-rows: repeat(${this.STICKERS_PER_COL}, 1fr);
            gap: 0;
            page-break-after: always;
            page-break-inside: avoid;
            overflow: hidden;
          }

          .sticker {
            border: 0.4px solid #000;
            padding: 1.4mm;
            display: flex;
            flex-direction: column;
            justify-content: center;
            background: white;
            page-break-inside: avoid;
            overflow: hidden;
          }

          .sticker-header {
            border-bottom: 1px solid #333;
            margin-bottom: 1mm;
            padding-bottom: 0.8mm;
          }

          .sticker-title {
            font-weight: bold;
            font-size: 8px;
            text-align: center;
            color: #333;
            word-wrap: break-word;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            line-height: 1.2;
          }

          .sticker-content {
            display: flex;
            flex-direction: column;
            gap: 0.6mm;
            justify-content: center;
          }

          .sticker-row {
            display: flex;
            font-size: 6px;
            gap: 0.6mm;
          }

          .sticker-label {
            font-weight: bold;
            min-width: 10mm;
            color: #444;
          }

          .sticker-value {
            flex-grow: 1;
            word-break: break-word;
            color: #333;
            font-size: 6px;
          }
        </style>
      </head>
      <body>
        ${stickers}
      </body>
      </html>
    `;
  }

  /**
   * Generate individual sticker elements
   */
  private generateStickerElements(
    stickerData: StickerData,
    quantity: number,
  ): string {
    const totalPages = Math.ceil(
      quantity / (this.STICKERS_PER_ROW * this.STICKERS_PER_COL),
    );
    const stickersPerPage = this.STICKERS_PER_ROW * this.STICKERS_PER_COL;
    let html = '';

    for (let page = 0; page < totalPages; page++) {
      html += '<div class="page">';

      const stickersInThisPage = Math.min(
        stickersPerPage,
        quantity - page * stickersPerPage,
      );

      for (let i = 0; i < stickersInThisPage; i++) {
        html += this.generateStickerHTML(stickerData);
      }

      // Fill empty cells with invisible stickers for grid alignment
      for (let i = stickersInThisPage; i < stickersPerPage; i++) {
        html += '<div class="sticker" style="visibility: hidden;"></div>';
      }

      html += '</div>';
    }

    return html;
  }

  /**
   * Generate single sticker HTML
   */
  private generateStickerHTML(stickerData: StickerData): string {
    return `
      <div class="sticker">
        <div class="sticker-header">
          <div class="sticker-title">${this.escapeHtml(stickerData.itemName)}</div>
        </div>
        <div class="sticker-content">
          <div class="sticker-row">
            <span class="sticker-label">Batch:</span>
            <span class="sticker-value">${this.escapeHtml(stickerData.batchCode)}</span>
          </div>
          <div class="sticker-row">
            <span class="sticker-label">M. Date:</span>
            <span class="sticker-value">${this.escapeHtml(stickerData.manufacturingDate)}</span>
          </div>
          <div class="sticker-row">
            <span class="sticker-label">E. Date:</span>
            <span class="sticker-value">${this.escapeHtml(stickerData.expiryDate)}</span>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Escape HTML special characters
   */
  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
