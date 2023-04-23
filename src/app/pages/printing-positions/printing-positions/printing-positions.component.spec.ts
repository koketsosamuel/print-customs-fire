import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintingPositionsComponent } from './printing-positions.component';

describe('PrintingPositionsComponent', () => {
  let component: PrintingPositionsComponent;
  let fixture: ComponentFixture<PrintingPositionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintingPositionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintingPositionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
