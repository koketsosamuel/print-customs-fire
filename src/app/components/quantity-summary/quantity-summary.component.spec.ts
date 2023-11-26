import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuantitySummaryComponent } from './quantity-summary.component';

describe('QuantitySummaryComponent', () => {
  let component: QuantitySummaryComponent;
  let fixture: ComponentFixture<QuantitySummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuantitySummaryComponent]
    });
    fixture = TestBed.createComponent(QuantitySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
