import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCustomPrintingMethodsComponent } from './select-custom-printing-methods.component';

describe('SelectCustomPrintingMethodsComponent', () => {
  let component: SelectCustomPrintingMethodsComponent;
  let fixture: ComponentFixture<SelectCustomPrintingMethodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectCustomPrintingMethodsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectCustomPrintingMethodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
