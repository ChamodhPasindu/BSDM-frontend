import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: { legend: { display: true } },
  };

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      { label: 'Sales', data: [65, 59, 80, 81, 56] },
      { label: 'Profit', data: [28, 48, 40, 19, 86] },
    ],
  };

  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
  };

  pieChartData = {
    labels: ['Download Sales', 'In-Store Sales', 'Mail Sales'],
    datasets: [
      {
        data: [300, 500, 100],
        backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726'],
      },
    ],
  };
  constructor() {}

  ngOnInit() {}
}
