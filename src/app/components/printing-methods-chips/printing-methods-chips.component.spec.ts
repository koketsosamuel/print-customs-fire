import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintingMethodsChipsComponent } from './printing-methods-chips.component';

describe('PrintingMethodsChipsComponent', () => {
  let component: PrintingMethodsChipsComponent;
  let fixture: ComponentFixture<PrintingMethodsChipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintingMethodsChipsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintingMethodsChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
