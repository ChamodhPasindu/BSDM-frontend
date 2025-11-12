import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaginationType } from 'src/app/enums/PaginationType.enum';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
})
export class PaginatorComponent {
  protected readonly PaginationType = PaginationType;

  @Input() public paginationType: PaginationType =
    PaginationType.COMPLETE_PAGINATOR;
  @Input() public totalItems = 0;
  @Input() public pageSize = 10;
  @Input() public pageSizes: number[] = [5, 10, 20, 50];
  @Input() public currentPage = 1;

  @Output() public currentPageChange = new EventEmitter<number>();
  @Output() public pageSizeChange = new EventEmitter<number>();

  protected get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  protected get visiblePages(): (number | string)[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const delta = 2;
    const range: (number | string)[] = [];

    const left = Math.max(2, current - delta);
    const right = Math.min(total - 1, current + delta);

    range.push(1);
    if (left > 2) range.push('...');
    for (let i = left; i <= right; i++) range.push(i);
    if (right < total - 1) range.push('...');
    if (total > 1) range.push(total);

    return range;
  }

  protected goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.currentPageChange.emit(page);
  }

  protected onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.pageSizeChange.emit(newSize);
  }

  protected isNumber(value: any): value is number {
    return typeof value === 'number';
  }
}
