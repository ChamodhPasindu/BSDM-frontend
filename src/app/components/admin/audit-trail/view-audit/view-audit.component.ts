import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-audit',
  templateUrl: './view-audit.component.html',
  styleUrls: ['./view-audit.component.scss']
})
export class ViewAuditComponent implements OnInit {

  constructor() {}

  ngOnInit() {}

  @Input() audit: any;
  public visible = false;

  protected closeModal(): void {
    this.visible = !this.visible;
  }

  protected changeModalVisibility(event: boolean): void {
    this.visible = event;
  }
}
