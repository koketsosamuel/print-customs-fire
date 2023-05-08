import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageCanvasPositionComponent } from './image-canvas-position.component';

describe('ImageCanvasPositionComponent', () => {
  let component: ImageCanvasPositionComponent;
  let fixture: ComponentFixture<ImageCanvasPositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageCanvasPositionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageCanvasPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
