import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleProductViewImagesComponent } from './single-product-view-images.component';

describe('SingleProductViewImagesComponent', () => {
  let component: SingleProductViewImagesComponent;
  let fixture: ComponentFixture<SingleProductViewImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleProductViewImagesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleProductViewImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
