import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPrintingPositionsComponent } from './add-printing-positions.component';

describe('AddPrintingPositionsComponent', () => {
  let component: AddPrintingPositionsComponent;
  let fixture: ComponentFixture<AddPrintingPositionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPrintingPositionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPrintingPositionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
