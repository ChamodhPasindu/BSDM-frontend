import { Injectable } from '@angular/core';
import { IPaymentSummary } from 'src/app/interfaces/IPaymentSummary';
import * as moment from 'moment';
import jsPDF from 'jspdf';

export interface ReceiptPrinterOptions {
  paymentData: IPaymentSummary;
  companyName?: string;
  mobileNumber?: string;
  receiptTitle?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ReceiptPrinterService {
  private readonly PAPER_WIDTH = 40; // Standard 80mm thermal printer (40 characters)
  private readonly RECEIPT_WIDTH = 80; // 80mm in mm

  constructor() {}

  public printReceipt(options: ReceiptPrinterOptions): void {
    const {
      paymentData,
      companyName = 'VISCO BAKEHOUSE',
      mobileNumber = '+94 (0) 123 456 789',
      receiptTitle = 'PAYMENT RECEIPT',
    } = options;

    const receiptHTML = this.generateReceiptHTML(
      paymentData,
      companyName,
      mobileNumber,
      receiptTitle
    );

    // Create a new window for printing
    const printWindow = window.open('', '', 'width=400,height=600');
    if (printWindow) {
      printWindow.document.write(receiptHTML);
      printWindow.document.close();

      // Wait for content to load, then print
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
        // Close after printing
        setTimeout(() => {
          printWindow.close();
        }, 250);
      };
    }
  }

  public downloadReceiptAsPDF(options: ReceiptPrinterOptions): void {
    const {
      paymentData,
      companyName = 'VISCO BAKEHOUSE',
      mobileNumber = '+94 (0) 123 456 789',
      receiptTitle = 'PAYMENT RECEIPT',
    } = options;

    // Create PDF with 80mm width
    const doc = new jsPDF('p', 'mm', [this.RECEIPT_WIDTH, 200]); // 80mm width, auto height
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 3;
    let yPosition = margin;

    const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');

    // Helper functions
    const centerText = (text: string, fontSize: number = 10): number => {
      doc.setFontSize(fontSize);
      const textWidth = doc.getTextWidth(text);
      const xPosition = (pageWidth - textWidth) / 2;
      doc.text(text, xPosition, yPosition);
      yPosition += fontSize / 2.5;
      return yPosition;
    };

    const leftText = (text: string, fontSize: number = 9): void => {
      doc.setFontSize(fontSize);
      doc.text(text, margin, yPosition);
      yPosition += fontSize / 2.2;
    };

    const addLine = (char: string = '─'): void => {
      const lineText = char.repeat(25);
      doc.setFontSize(8);
      doc.text(lineText, margin, yPosition);
      yPosition += 3;
    };

    // Header
    doc.setFont('helvetica', 'bold');
    centerText(companyName, 12);
    doc.setFont('helvetica', 'normal');
    centerText(receiptTitle, 10);
    centerText(mobileNumber, 9);
    doc.setTextColor(100, 100, 100);
    centerText(currentDate, 8);
    doc.setTextColor(0, 0, 0);

    addLine('═');

    // Customer Info
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    leftText(`Bill ID: ${paymentData.orderReferenceNumber}`);
    doc.setFont('helvetica', 'normal');
    leftText(`Customer: ${paymentData.customerName}`);
    leftText(`Shop: ${paymentData.customerShopName}`);
    leftText(`Date: ${moment(paymentData.orderDate).format('DD/MM/YYYY')}`);

    addLine('─');

    // Products Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    leftText('PRODUCT                 QTY  PRICE');

    addLine('─');

    // Products
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);

    const formatNumber = (num: number | string): string => {
      if (!num) return '0.00';
      const number = typeof num === 'string' ? parseFloat(num) : num;
      return number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    paymentData.items.forEach((item) => {
      const productName = (item['productName'] || '').substring(0, 20);
      const quantity = item['quantity'] || 0;
      const price = item['sellingPrice'] || 0;
      const lineTotal = (item['lineTotal'] || 0) as number;

      leftText(`${productName.padEnd(20)} ${String(quantity).padStart(3)}`);
      leftText(`LKR ${formatNumber(lineTotal).padStart(18)}`);
      yPosition += 1;
    });

    addLine('─');

    // Totals
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    const needToPay = paymentData.needToPay || 0;
    const totalAmount = paymentData.totalAmount || 0;
    const paidAmount = paymentData.paidAmount || 0;

    leftText(`Total: LKR ${formatNumber(totalAmount)}`);

    if (needToPay > 0) {
      doc.setTextColor(220, 53, 69);
      leftText(`Outstanding: LKR ${formatNumber(needToPay)}`);
      doc.setTextColor(0, 0, 0);
    }

    leftText(`Paid: LKR ${formatNumber(paidAmount)}`);

    addLine('═');

    // Payment Details
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    yPosition += 2;
    centerText('PAYMENT DETAILS', 10);

    addLine('─');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const paymentStatus = paymentData.paymentStatus || 'UNKNOWN';
    leftText(`Status: ${paymentStatus}`);

    if (paymentData.paymentDates?.['getFirstPaidDate']) {
      leftText(
        `Paid: ${moment(paymentData.paymentDates['getFirstPaidDate']).format(
          'DD/MM/YYYY'
        )}`
      );
    }

    if (
      paymentStatus === 'FULL_PAYMENT' ||
      paymentStatus === 'Full Payment'
    ) {
      const settledDate =
        paymentData.paymentDates?.['getBillSettledDate'] ||
        paymentData.paymentDates?.['getFirstPaidDate'];
      if (settledDate) {
        leftText(
          `Settled: ${moment(settledDate).format('DD/MM/YYYY')}`
        );
      }
    }

    addLine('─');

    // Footer
    yPosition += 3;
    doc.setFont('helvetica', 'bold');
    centerText('Thank You!', 10);
    doc.setFont('helvetica', 'normal');
    centerText('For Your Business', 9);

    yPosition += 3;
    doc.setTextColor(120, 120, 120);
    doc.setFontSize(7);
    centerText('System generated receipt', 8);
    centerText('© VISCO BAKEHOUSE', 8);

    // Generate filename with timestamp
    const filename = `Receipt_${paymentData.orderReferenceNumber}_${moment().format(
      'YYYY-MM-DD_HHmm'
    )}.pdf`;

    // Save PDF
    doc.save(filename);
  }

  private generateReceiptHTML(
    paymentData: IPaymentSummary,
    companyName: string,
    mobileNumber: string,
    receiptTitle: string
  ): string {
    const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');

    // Format numbers with commas
    const formatNumber = (num: number | string): string => {
      if (!num) return '0.00';
      const number = typeof num === 'string' ? parseFloat(num) : num;
      return number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    let receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Receipt</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: 'Courier New', Courier, monospace;
            background: #f5f5f5;
            padding: 5mm;
          }

          .receipt-container {
            width: 80mm;
            max-width: 80mm;
            margin: 0 auto;
            background: white;
            padding: 4mm;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            font-size: 11px;
            line-height: 1.3;
          }

          .text-center {
            text-align: center;
          }

          .text-left {
            text-align: left;
          }

          .text-right {
            text-align: right;
          }

          .mb-1 {
            margin-bottom: 2px;
          }

          .mb-2 {
            margin-bottom: 4px;
          }

          .mt-2 {
            margin-top: 4px;
          }

          .divider {
            width: 100%;
            text-align: center;
            letter-spacing: 0.5px;
            margin: 3px 0;
            font-size: 10px;
          }

          .section-title {
            font-weight: bold;
            margin-top: 3px;
            margin-bottom: 2px;
            font-size: 11px;
          }

          .row {
            display: flex;
            justify-content: space-between;
            font-size: 10px;
            margin-bottom: 1px;
            word-wrap: break-word;
          }

          .row-label {
            flex: 0 0 auto;
            padding-right: 5px;
          }

          .row-value {
            flex: 1;
            text-align: right;
          }

          .product-row {
            display: flex;
            font-size: 9px;
            margin-bottom: 2px;
            word-break: break-word;
          }

          .product-name {
            flex: 1;
            min-width: 0;
            padding-right: 3px;
          }

          .product-qty {
            flex: 0 0 40px;
            text-align: center;
          }

          .product-price {
            flex: 0 0 45px;
            text-align: right;
          }

          .highlight-text {
            color: #dc3545;
            font-weight: bold;
          }

          @media print {
            body {
              background: white;
              padding: 0;
              margin: 0;
            }

            .receipt-container {
              width: 80mm;
              max-width: 80mm;
              margin: 0;
              padding: 3mm;
              box-shadow: none;
              page-break-after: avoid;
            }
          }

          @page {
            size: 80mm auto;
            margin: 0;
            padding: 0;
          }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          <!-- Header -->
          <div class="text-center mb-2">
            <div style="font-weight: bold; font-size: 12px; margin-bottom: 2px;">${companyName}</div>
            <div style="font-weight: bold; margin-bottom: 2px;">${receiptTitle}</div>
            <div style="font-size: 9px; margin-bottom: 1px;">${mobileNumber}</div>
            <div style="font-size: 8px; color: #666;">${currentDate}</div>
          </div>

          <div class="divider">═══════════════════════════════</div>

          <!-- Customer Info -->
          <div class="mb-1">
            <div class="row">
              <span class="row-label">Bill ID:</span>
              <span class="row-value">${paymentData.orderReferenceNumber}</span>
            </div>
            <div class="row">
              <span class="row-label">Customer:</span>
              <span class="row-value">${paymentData.customerName}</span>
            </div>
            <div class="row">
              <span class="row-label">Shop:</span>
              <span class="row-value">${paymentData.customerShopName}</span>
            </div>
            <div class="row">
              <span class="row-label">Date:</span>
              <span class="row-value">${moment(paymentData.orderDate).format('DD/MM/YYYY')}</span>
            </div>
          </div>

          <div class="divider">───────────────────────────────</div>

          <!-- Products -->
          <div class="section-title">ITEMS</div>
          <div style="margin-bottom: 2px; font-size: 9px; border-bottom: 1px dashed #ccc; padding-bottom: 2px;">
            <div class="product-row" style="font-weight: bold; margin-bottom: 2px;">
              <span class="product-name">Product</span>
              <span class="product-qty">Qty</span>
              <span class="product-price">Price</span>
            </div>
          </div>

          ${paymentData.items
            .map((item) => {
              const productName = (item['productName'] || 'N/A').substring(0, 25);
              const quantity = item['quantity'] || 0;
              const price = item['sellingPrice'] || 0;
              const lineTotal = (item['lineTotal'] || 0) as number;

              return `
                <div class="product-row">
                  <span class="product-name">${productName}</span>
                  <span class="product-qty">${quantity}</span>
                  <span class="product-price">LKR ${formatNumber(lineTotal)}</span>
                </div>
              `;
            })
            .join('')}

          <div class="divider">───────────────────────────────</div>

          <!-- Totals -->
          <div class="mb-2">
            <div class="row">
              <span class="row-label">Total:</span>
              <span class="row-value">LKR ${formatNumber(paymentData.totalAmount)}</span>
            </div>
            ${
              (paymentData.needToPay || 0) > 0
                ? `
              <div class="row">
                <span class="row-label highlight-text">Outstanding:</span>
                <span class="row-value highlight-text">LKR ${formatNumber(paymentData.needToPay)}</span>
              </div>
            `
                : ''
            }
            <div class="row">
              <span class="row-label">Paid:</span>
              <span class="row-value">LKR ${formatNumber(paymentData.paidAmount)}</span>
            </div>
          </div>

          <div class="divider">═══════════════════════════════</div>

          <!-- Payment Details -->
          <div class="section-title text-center">PAYMENT DETAILS</div>
          <div class="mb-2">
            <div class="row">
              <span class="row-label">Status:</span>
              <span class="row-value">${paymentData.paymentStatus || 'N/A'}</span>
            </div>
            ${
              paymentData.paymentDates?.['getFirstPaidDate']
                ? `
              <div class="row">
                <span class="row-label">Paid Date:</span>
                <span class="row-value">${moment(paymentData.paymentDates['getFirstPaidDate']).format('DD/MM/YYYY')}</span>
              </div>
            `
                : ''
            }
            ${
              paymentData.paymentStatus === 'FULL_PAYMENT' ||
              paymentData.paymentStatus === 'Full Payment'
                ? `
              <div class="row">
                <span class="row-label">Settled:</span>
                <span class="row-value">${moment(
                  paymentData.paymentDates?.['getBillSettledDate'] ||
                    paymentData.paymentDates?.['getFirstPaidDate']
                ).format('DD/MM/YYYY')}</span>
              </div>
            `
                : ''
            }
          </div>

          <div class="divider">───────────────────────────────</div>

          <!-- Footer -->
          <div class="text-center" style="margin-top: 4px; font-size: 10px;">
            <div style="font-weight: bold; margin-bottom: 2px;">Thank You!</div>
            <div style="margin-bottom: 3px;">For Your Business</div>
            <div style="font-size: 8px; color: #999;">System generated receipt</div>
            <div style="font-size: 8px; color: #999;">© VISCO BAKEHOUSE</div>
          </div>
        </div>
      </body>
      </html>
    `;

    return receiptHTML;
  }
}
