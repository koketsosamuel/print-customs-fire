import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintingMethodsFormComponent } from './printing-methods-form.component';

describe('PrintingMethodsFormComponent', () => {
  let component: PrintingMethodsFormComponent;
  let fixture: ComponentFixture<PrintingMethodsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintingMethodsFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintingMethodsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
