import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostBreakdownComponent } from './cost-breakdown.component';

describe('CostBreakdownComponent', () => {
  let component: CostBreakdownComponent;
  let fixture: ComponentFixture<CostBreakdownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CostBreakdownComponent]
    });
    fixture = TestBed.createComponent(CostBreakdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
