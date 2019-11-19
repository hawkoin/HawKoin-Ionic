import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpenderPage } from './spender.page';

describe('SpenderPage', () => {
  let component: SpenderPage;
  let fixture: ComponentFixture<SpenderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SpenderPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpenderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
