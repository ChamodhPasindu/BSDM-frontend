import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  notifications = [
    {
      title: 'Admin assigned new stocks to you',
      time: new Date('2025-11-07T10:30:00'),
      type: 'stock',
      icon: 'cilGift',
    },
    {
      title: 'Payment completed successfully (Bill #B003)',
      time: new Date('2025-11-07T12:15:00'),
      type: 'payment',
      icon: 'cilCash',
    },
    {
      title: 'Bill #B003 has been printed',
      time: new Date('2025-11-07T12:20:00'),
      type: 'print',
      icon: 'cilPrint',
    },
    {
      title: 'Returned remaining stock items to inventory',
      time: new Date('2025-11-07T15:00:00'),
      type: 'return',
      icon: 'cilArrowCircleLeft',
    },
  ];

  clearAll() {
    if (confirm('Are you sure you want to delete all notifications?')) {
      this.notifications = [];
    }
  }
}
