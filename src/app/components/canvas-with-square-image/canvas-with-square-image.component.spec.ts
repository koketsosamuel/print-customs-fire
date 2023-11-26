import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasWithSquareImageComponent } from './canvas-with-square-image.component';

describe('CanvasWithSquareImageComponent', () => {
  let component: CanvasWithSquareImageComponent;
  let fixture: ComponentFixture<CanvasWithSquareImageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CanvasWithSquareImageComponent]
    });
    fixture = TestBed.createComponent(CanvasWithSquareImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
