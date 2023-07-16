import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorVariantSelectorComponent } from './color-variant-selector.component';

describe('ColorVariantSelectorComponent', () => {
  let component: ColorVariantSelectorComponent;
  let fixture: ComponentFixture<ColorVariantSelectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ColorVariantSelectorComponent]
    });
    fixture = TestBed.createComponent(ColorVariantSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
