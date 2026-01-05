import { Component, OnInit } from '@angular/core';
import { ModalControlDirective } from 'src/app/utility/directives/modal-control.directive';

@Component({
  selector: 'app-review-return-stock',
  templateUrl: './review-return-stock.component.html',
  styleUrls: ['./review-return-stock.component.scss'],
})
export class ReviewReturnStockComponent
  extends ModalControlDirective
  implements OnInit
{
  constructor() {
    super();
  }

  ngOnInit() {}

  public loadData(): void {}

  protected override resetState(): void {}

  protected onReturnStockChange($event: any) {}

  protected onSubmit() {}
}
