import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintingMethodsSelectComponent } from './printing-methods-select.component';

describe('PrintingMethodsSelectComponent', () => {
  let component: PrintingMethodsSelectComponent;
  let fixture: ComponentFixture<PrintingMethodsSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintingMethodsSelectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintingMethodsSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
