import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartItemDialogSummaryComponent } from './cart-item-dialog-summary.component';

describe('CartItemDialogSummaryComponent', () => {
  let component: CartItemDialogSummaryComponent;
  let fixture: ComponentFixture<CartItemDialogSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CartItemDialogSummaryComponent]
    });
    fixture = TestBed.createComponent(CartItemDialogSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
