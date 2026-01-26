/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { SalesPaymentSummaryBottomSheetComponent } from './sales-payment-summary-bottom-sheet.component';


describe('SalesPaymentSummaryBottomSheetComponent', () => {
  let component: SalesPaymentSummaryBottomSheetComponent;
  let fixture: ComponentFixture<SalesPaymentSummaryBottomSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesPaymentSummaryBottomSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesPaymentSummaryBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
