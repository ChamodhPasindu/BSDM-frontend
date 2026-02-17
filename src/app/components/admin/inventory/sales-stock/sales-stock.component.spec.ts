/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SalesStockComponent } from './sales-stock.component';

describe('SalesStockComponent', () => {
  let component: SalesStockComponent;
  let fixture: ComponentFixture<SalesStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
