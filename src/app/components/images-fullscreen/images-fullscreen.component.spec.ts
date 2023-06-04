import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagesFullscreenComponent } from './images-fullscreen.component';

describe('ImagesFullscreenComponent', () => {
  let component: ImagesFullscreenComponent;
  let fixture: ComponentFixture<ImagesFullscreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImagesFullscreenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImagesFullscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
