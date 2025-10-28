import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-report-explore',
  templateUrl: './admin-report-explore.component.html',
  styleUrls: ['./admin-report-explore.component.scss']
})
export class AdminReportExploreComponent implements OnInit {
  @Input() public title: string;

  constructor() { }

  ngOnInit() {
  }

}
