import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageQualityMeterComponent } from './image-quality-meter.component';

describe('ImageQualityMeterComponent', () => {
  let component: ImageQualityMeterComponent;
  let fixture: ComponentFixture<ImageQualityMeterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImageQualityMeterComponent]
    });
    fixture = TestBed.createComponent(ImageQualityMeterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
