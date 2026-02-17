/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EditViewStockComponent } from './edit-view-stock.component';

describe('EditViewStockComponent', () => {
  let component: EditViewStockComponent;
  let fixture: ComponentFixture<EditViewStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditViewStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditViewStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
