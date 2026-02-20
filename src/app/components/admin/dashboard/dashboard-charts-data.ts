import { Injectable } from '@angular/core';
import { getStyle, hexToRgba } from '@coreui/utils';

export interface IChartProps {
  data?: any;
  labels?: any;
  options?: any;
  colors?: any;
  type?: any;
  legend?: any;

  [propName: string]: any;
}

@Injectable({
  providedIn: 'any',
})
export class DashboardChartsData {
  constructor() {
    this.initMainChart();
    this.initDoughnutChart();
  }

  public mainChart: IChartProps = {};
  public doughnutChart: IChartProps = {};

  /** Generates `count` visually distinct colors evenly spread across the hue wheel. */
  public generateColors(count: number): string[] {
    return Array.from(
      { length: count },
      (_, i) => `hsl(${Math.round((i * 360) / count)}, 65%, 50%)`,
    );
  }

  public initMainChart(): void {
    const brandSuccess = getStyle('--cui-success') ?? '#4dbd74';
    const brandInfo = getStyle('--cui-info') ?? '#20a8d8';
    const brandInfoBg = hexToRgba(brandInfo, 10);
    const brandDanger = getStyle('--cui-danger') || '#f86c6b';

    const colors = [
      {
        backgroundColor: brandInfoBg,
        borderColor: brandInfo,
        pointHoverBackgroundColor: brandInfo,
        borderWidth: 2,
        fill: true,
      },
      {
        backgroundColor: 'transparent',
        borderColor: brandSuccess || '#4dbd74',
        pointHoverBackgroundColor: '#fff',
      },
      {
        backgroundColor: 'transparent',
        borderColor: brandDanger || '#f86c6b',
        pointHoverBackgroundColor: brandDanger,
        borderWidth: 1,
        borderDash: [8, 5],
      },
    ];

    const datasets = [{ data: [], label: 'Sales', ...colors[0] }];

    const plugins = {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          labelColor: function (context: any) {
            return {
              backgroundColor: context.dataset.borderColor,
            };
          },
        },
      },
    };

    const options = {
      maintainAspectRatio: false,
      plugins,
      scales: {
        x: {
          grid: {
            drawOnChartArea: false,
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            maxTicksLimit: 5,
          },
        },
      },
      elements: {
        line: {
          tension: 0.4,
        },
        point: {
          radius: 0,
          hitRadius: 10,
          hoverRadius: 4,
          hoverBorderWidth: 3,
        },
      },
    };

    this.mainChart.type = 'line';
    this.mainChart.options = options;
    this.mainChart.data = {
      datasets,
      labels: [],
    };
  }

  public initDoughnutChart(): void {
    const options = {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
        },
        tooltip: {
          callbacks: {
            label: (context: any) =>
              ` ${context.label}: ${context.formattedValue}`,
          },
        },
      },
    };

    this.doughnutChart.type = 'doughnut';
    this.doughnutChart.options = options;
    this.doughnutChart.data = {
      labels: [],
      datasets: [{ data: [], backgroundColor: [] }],
    };
  }
}
