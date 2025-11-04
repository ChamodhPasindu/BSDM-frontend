import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ViewReturnStockComponent } from './view-return-stock/view-return-stock.component';

@Component({
  selector: 'app-return-stock',
  templateUrl: './return-stock.component.html',
  styleUrls: ['./return-stock.component.scss'],
})
export class ReturnStockComponent implements OnInit {
@ViewChild('returnStockModal') returnStockModal!: ViewReturnStockComponent;


openReturnStockView(returnStock?:any) {
  this.returnStockModal.returnStock = returnStock;
  this.returnStockModal.visible = true;
}

constructor() {}
ngOnInit() {}
selectedDate: Date | null = null;

public users: any[] = [
  {
    name: 'Yiorgos Avraamu',
    state: 'New',
    registered: 'Jan 1, 2021',
    country: 'Us',
    usage: 50,
    period: 'Jun 11, 2021 - Jul 10, 2021',
    payment: 'Mastercard',
    activity: '10 sec ago',
    avatar: './assets/img/avatars/1.jpg',
    status: 'success',
    color: 'success',
  },
  {
    name: 'Avram Tarasios',
    state: 'Recurring ',
    registered: 'Jan 1, 2021',
    country: 'Br',
    usage: 10,
    period: 'Jun 11, 2021 - Jul 10, 2021',
    payment: 'Visa',
    activity: '5 minutes ago',
    avatar: './assets/img/avatars/2.jpg',
    status: 'danger',
    color: 'info',
  },
  {
    name: 'Quintin Ed',
    state: 'New',
    registered: 'Jan 1, 2021',
    country: 'In',
    usage: 74,
    period: 'Jun 11, 2021 - Jul 10, 2021',
    payment: 'Stripe',
    activity: '1 hour ago',
    avatar: './assets/img/avatars/3.jpg',
    status: 'warning',
    color: 'warning',
  },
  {
    name: 'Enéas Kwadwo',
    state: 'Sleep',
    registered: 'Jan 1, 2021',
    country: 'Fr',
    usage: 98,
    period: 'Jun 11, 2021 - Jul 10, 2021',
    payment: 'Paypal',
    activity: 'Last month',
    avatar: './assets/img/avatars/4.jpg',
    status: 'secondary',
    color: 'danger',
  },
  {
    name: 'Agapetus Tadeáš',
    state: 'New',
    registered: 'Jan 1, 2021',
    country: 'Es',
    usage: 22,
    period: 'Jun 11, 2021 - Jul 10, 2021',
    payment: 'ApplePay',
    activity: 'Last week',
    avatar: './assets/img/avatars/5.jpg',
    status: 'success',
    color: 'primary',
  },
  {
    name: 'Friderik Dávid',
    state: 'New',
    registered: 'Jan 1, 2021',
    country: 'Pl',
    usage: 43,
    period: 'Jun 11, 2021 - Jul 10, 2021',
    payment: 'Amex',
    activity: 'Yesterday',
    avatar: './assets/img/avatars/6.jpg',
    status: 'info',
    color: 'dark',
  },
  {
    name: 'Friderik Dávid',
    state: 'New',
    registered: 'Jan 1, 2021',
    country: 'Pl',
    usage: 43,
    period: 'Jun 11, 2021 - Jul 10, 2021',
    payment: 'Amex',
    activity: 'Yesterday',
    avatar: './assets/img/avatars/6.jpg',
    status: 'info',
    color: 'dark',
  },
  {
    name: 'Friderik Dávid',
    state: 'New',
    registered: 'Jan 1, 2021',
    country: 'Pl',
    usage: 43,
    period: 'Jun 11, 2021 - Jul 10, 2021',
    payment: 'Amex',
    activity: 'Yesterday',
    avatar: './assets/img/avatars/6.jpg',
    status: 'info',
    color: 'dark',
  },
  {
    name: 'Friderik Dávid',
    state: 'New',
    registered: 'Jan 1, 2021',
    country: 'Pl',
    usage: 43,
    period: 'Jun 11, 2021 - Jul 10, 2021',
    payment: 'Amex',
    activity: 'Yesterday',
    avatar: './assets/img/avatars/6.jpg',
    status: 'info',
    color: 'dark',
  },
  {
    name: 'Friderik Dávid',
    state: 'New',
    registered: 'Jan 1, 2021',
    country: 'Pl',
    usage: 43,
    period: 'Jun 11, 2021 - Jul 10, 2021',
    payment: 'Amex',
    activity: 'Yesterday',
    avatar: './assets/img/avatars/6.jpg',
    status: 'info',
    color: 'dark',
  },
];

protected delete() {
  Swal.fire({
    title: 'Confirm Delete',
    text: 'message',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, Delete',
    cancelButtonText: 'Cancel',
    reverseButtons: true,
    customClass: {
      popup: 'coreui-popup',
      confirmButton: 'btn btn-danger ms-2',
      cancelButton: 'btn btn-secondary',
    },
    buttonsStyling: false,
  }).then((result) => {
    if (result.isConfirmed) {
      // your delete logic
      Swal.fire('Deleted!', 'The record has been deleted.', 'success');
    }
  });
}
}
