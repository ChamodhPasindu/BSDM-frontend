/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SalesEmptyDataComponent } from './sales-empty-data.component';

describe('SalesEmptyDataComponent', () => {
  let component: SalesEmptyDataComponent;
  let fixture: ComponentFixture<SalesEmptyDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesEmptyDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesEmptyDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
