/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RouteViewComponent } from './route-view.component';

describe('RouteViewComponent', () => {
  let component: RouteViewComponent;
  let fixture: ComponentFixture<RouteViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouteViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
