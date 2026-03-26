import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sales-empty-data',
  templateUrl: './sales-empty-data.component.html',
  styleUrls: ['./sales-empty-data.component.scss'],
})
export class SalesEmptyDataComponent {
  @Input() name: string;
}
