import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailsSummaryComponent } from './product-details-summary.component';

describe('ProductDetailsSummaryComponent', () => {
  let component: ProductDetailsSummaryComponent;
  let fixture: ComponentFixture<ProductDetailsSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductDetailsSummaryComponent]
    });
    fixture = TestBed.createComponent(ProductDetailsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
