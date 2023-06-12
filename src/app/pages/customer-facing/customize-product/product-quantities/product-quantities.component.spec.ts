import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductQuantitiesComponent } from './product-quantities.component';

describe('ProductQuantitiesComponent', () => {
  let component: ProductQuantitiesComponent;
  let fixture: ComponentFixture<ProductQuantitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductQuantitiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductQuantitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
