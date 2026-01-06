import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Router } from '@angular/router';
import { SaleService } from 'src/app/services/sale/sale.service';
import { IDraftOrder } from 'src/app/interfaces/IDraftOrder';
import {
  alertError,
  alertSuccess,
  errorMessageHandler,
} from 'src/app/utility/helper';
import {
  RESPONSE_MESSAGES,
  RESPONSE_TITLES,
} from 'src/app/utility/constants/response-message-title';
import { RSP_SUCCESS } from 'src/app/utility/constants/response-code';
import { HttpErrorResponse } from '@angular/common/http';
import { IResponse } from 'src/app/interfaces/IResponse';

@UntilDestroy()
@Component({
  selector: 'app-draft-orders',
  templateUrl: './draft-orders.component.html',
  styleUrls: ['./draft-orders.component.scss'],
})
export class DraftOrdersComponent implements OnInit {
  protected draftOrders = [
    {
      id: 'ORD-9f3a1c2e',
      status: 'DRAFT',
      createdAt: new Date('2026-01-05T09:15:00'),
      updatedAt: new Date('2026-01-05T10:30:00'),
      totalAmount: 12500,
      orderItems: [
        {
          productName: 'Rice 5kg',
          quantity: 2,
          price: 2500,
          totalAmount: 5000,
        },
        {
          productName: 'Dhal 1kg',
          quantity: 3,
          price: 1200,
          totalAmount: 3600,
        },
        {
          productName: 'Sugar 1kg',
          quantity: 2,
          price: 1950,
          totalAmount: 3900,
        },
      ],
    },
    {
      id: 'ORD-b72d88fa',
      status: 'DRAFT',
      createdAt: new Date('2026-01-04T14:45:00'),
      totalAmount: 4800,
      orderItems: [
        {
          productName: 'Milk Powder 400g',
          quantity: 4,
          price: 1200,
          totalAmount: 4800,
        },
      ],
    },
    {
      id: 'ORD-1caa47e9',
      status: 'DRAFT',
      createdAt: new Date('2026-01-03T11:20:00'),
      updatedAt: new Date('2026-01-03T12:10:00'),
      totalAmount: 8600,
      orderItems: [
        {
          productName: 'Cooking Oil 1L',
          quantity: 2,
          price: 2300,
          totalAmount: 4600,
        },
        {
          productName: 'Wheat Flour 2kg',
          quantity: 2,
          price: 2000,
          totalAmount: 4000,
        },
      ],
    },
  ];
  protected selectedDrafts: Set<string> = new Set();
  protected expandedOrderId: string | null = null;

  constructor(
    private readonly saleService: SaleService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadDraftOrders();
  }

  private loadDraftOrders(): void {}

  protected toggleExpandOrder(orderId: string | null): void {
    this.expandedOrderId = this.expandedOrderId === orderId ? null : orderId;
  }

  protected submitCompletedOrders(): void {}

  protected goBack(): void {
    this.router.navigate(['/sales/post-login/easy-order']);
  }
}
