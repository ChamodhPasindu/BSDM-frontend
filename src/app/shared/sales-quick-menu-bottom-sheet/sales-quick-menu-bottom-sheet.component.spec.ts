/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SalesQuickMenuBottomSheetComponent } from './sales-quick-menu-bottom-sheet.component';

describe('SalesQuickMenuBottomSheetComponent', () => {
  let component: SalesQuickMenuBottomSheetComponent;
  let fixture: ComponentFixture<SalesQuickMenuBottomSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesQuickMenuBottomSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesQuickMenuBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
