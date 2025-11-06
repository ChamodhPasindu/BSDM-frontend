import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxBottomSheetService } from 'ngx-bottom-sheet';

@Component({
  selector: 'app-sales-bottom-nav',
  templateUrl: './sales-bottom-nav.component.html',
  styleUrls: ['./sales-bottom-nav.component.scss'],
})
export class SalesBottomNavComponent implements OnInit {
  constructor(
    private router: Router,
    private bottomSheetService: NgxBottomSheetService
  ) {}

  ngOnInit(): void {}

  showBottomSheet = false;

  toggleBottomSheet() {
    this.bottomSheetService.open(MyCustomComponent, {
      height: 'mid',
      showCloseButton: true,
      backgroundColor: '#fff',
      data: {
        title: 'Hello World',
        content: 'This is dynamic content!',
      },
    });
  }
}

// Define the component to be displayed in the bottom sheet
@Component({
  selector: 'app-my-custom-component',
  template: `
    <div>
      <h2>{{ currentData?.title }}</h2>
      <p>{{ currentData?.content }}</p>
    </div>
  `,
})
export class MyCustomComponent {
  currentData: any;

  constructor(private bottomSheetService: NgxBottomSheetService) {
    this.currentData = this.bottomSheetService.currentSheetData;
  }
}
