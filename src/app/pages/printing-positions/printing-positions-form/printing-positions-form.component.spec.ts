import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintingPositionsFormComponent } from './printing-positions-form.component';

describe('PrintingPositionsFormComponent', () => {
  let component: PrintingPositionsFormComponent;
  let fixture: ComponentFixture<PrintingPositionsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintingPositionsFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintingPositionsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
