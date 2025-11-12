import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewPaymentComponent } from './view-payment/view-payment.component';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import Swal from 'sweetalert2';
import { alertWarning } from 'src/app/utility/helper';

const DATA_COUNT = 5;
const NUMBER_CFG = { count: DATA_COUNT, min: 0, max: 100 };

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
})
export class PaymentsComponent implements OnInit {
  @ViewChild('paymentModal') paymentModal!: ViewPaymentComponent;

  protected openPaymentView(payment?: any) {
    this.paymentModal.payment = payment;
    this.paymentModal.visible = true;
  }

  protected users: any[] = [];
  protected routes: any[] = [];
  protected pagedUsers: any[] = [];
  protected pagedRoutes: any[] = [];

  protected currentUserPage = 1;
  protected currentRoutePage = 1;
  protected userPageSize = 5;
  protected routePageSize = 5;

  ngOnInit(): void {
    // sample data
    this.users = Array.from({ length: 35 }, (_, i) => ({
      name: `User ${i + 1}`,
      nic: `NIC${1000 + i}`,
    }));

    this.routes = Array.from({ length: 35 }, (_, i) => ({
      name: `User ${i + 1}`,
      nic: `NIC${1000 + i}`,
    }));

    this.updatePagedUsers();
    this.updatePagedRoute();
  }

  protected goToUserPage(page: number): void {
    this.currentUserPage = page;
    this.updatePagedUsers();
  }

  protected goToRoutePage(page: number): void {
    this.currentRoutePage = page;
    this.updatePagedUsers();
  }

  protected onUserPageSizeChange(newSize: number): void {
    this.userPageSize = newSize;
    this.currentUserPage = 1;
    this.updatePagedUsers();
  }

  protected onRoutePageSizeChange(newSize: number): void {
    this.routePageSize = newSize;
    this.currentRoutePage = 1;
    this.updatePagedRoute();
  }

  protected updatePagedUsers(): void {
    const start = (this.currentUserPage - 1) * this.userPageSize;
    const end = start + this.userPageSize;
    this.pagedUsers = this.users.slice(start, end);
  }

  protected updatePagedRoute(): void {
    const start = (this.currentRoutePage - 1) * this.routePageSize;
    const end = start + this.routePageSize;
    this.pagedRoutes = this.routes.slice(start, end);
  }

  protected delete() {
    alertWarning({
      title: 'Confirm Delete',
      text: 'message',
    });
  }


  months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
  };

  chartLineData = {
    labels: [...this.months].slice(0, 7),
    datasets: [
      {
        label: 'My First dataset',
        backgroundColor: 'rgba(220, 220, 220, 0.2)',
        borderColor: 'rgba(220, 220, 220, 1)',
        pointBackgroundColor: 'rgba(220, 220, 220, 1)',
        pointBorderColor: '#fff',
        data: [
          this.randomData,
          this.randomData,
          this.randomData,
          this.randomData,
          this.randomData,
          this.randomData,
          this.randomData,
        ],
      },
      {
        label: 'My Second dataset',
        backgroundColor: 'rgba(151, 187, 205, 0.2)',
        borderColor: 'rgba(151, 187, 205, 1)',
        pointBackgroundColor: 'rgba(151, 187, 205, 1)',
        pointBorderColor: '#fff',
        data: [
          this.randomData,
          this.randomData,
          this.randomData,
          this.randomData,
          this.randomData,
          this.randomData,
          this.randomData,
        ],
      },
    ],
  };

  chartBarData = {
    labels: [...this.months].slice(0, 7),
    datasets: [
      {
        label: 'GitHub Commits',
        backgroundColor: '#f87979',
        data: [40, 20, 12, 39, 17, 42, 79],
      },
    ],
  };

  chartPieData = {
    labels: ['Red', 'Green', 'Yellow'],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  get randomData() {
    return Math.round(Math.random() * 100);
  }

  
}
