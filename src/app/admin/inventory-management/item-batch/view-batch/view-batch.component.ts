import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-batch',
  templateUrl: './view-batch.component.html',
  styleUrls: ['./view-batch.component.scss']
})
export class ViewBatchComponent implements OnInit {

  constructor() {}

  ngOnInit() {}

  @Input() batch: any;
  public visible = false;

  protected closeModal(): void {
    this.visible = !this.visible;
  }

  protected changeModalVisibility(event: boolean): void {
    this.visible = event;
  }

}
