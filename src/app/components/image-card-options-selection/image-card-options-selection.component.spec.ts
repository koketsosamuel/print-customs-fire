import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageCardOptionsSelectionComponent } from './image-card-options-selection.component';

describe('ImageCardOptionsSelectionComponent', () => {
  let component: ImageCardOptionsSelectionComponent;
  let fixture: ComponentFixture<ImageCardOptionsSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageCardOptionsSelectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageCardOptionsSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
