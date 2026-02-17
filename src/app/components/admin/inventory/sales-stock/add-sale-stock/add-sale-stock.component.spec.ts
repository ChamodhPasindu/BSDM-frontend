/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AddSaleStockComponent } from './add-sale-stock.component';

describe('AddSaleStockComponent', () => {
  let component: AddSaleStockComponent;
  let fixture: ComponentFixture<AddSaleStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSaleStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSaleStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
