import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintingMethodsViewComponent } from './printing-methods-view.component';

describe('PrintingMethodsViewComponent', () => {
  let component: PrintingMethodsViewComponent;
  let fixture: ComponentFixture<PrintingMethodsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintingMethodsViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintingMethodsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
