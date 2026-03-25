import { Component, Input, OnInit } from '@angular/core';
import { IAuditData } from 'src/app/interfaces/IAuditData';
import { ModalControlDirective } from 'src/app/utility/directives/modal-control.directive';

@Component({
  selector: 'app-view-audit',
  templateUrl: './view-audit.component.html',
  styleUrls: ['./view-audit.component.scss'],
})
export class ViewAuditComponent extends ModalControlDirective {
  private _audit: IAuditData | undefined;

  @Input()
  public set audit(value: IAuditData | undefined) {
    this._audit = value;
  }

  public get audit() {
    return this._audit;
  }

  constructor() {
    super();
  }

  protected override resetState(): void {}
}
