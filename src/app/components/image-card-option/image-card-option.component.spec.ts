import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageCardOptionComponent } from './image-card-option.component';

describe('ImageCardOptionComponent', () => {
  let component: ImageCardOptionComponent;
  let fixture: ComponentFixture<ImageCardOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageCardOptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageCardOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
