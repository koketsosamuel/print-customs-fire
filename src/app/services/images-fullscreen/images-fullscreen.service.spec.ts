import { TestBed } from '@angular/core/testing';

import { ImagesFullscreenService } from './images-fullscreen.service';

describe('ImagesFullscreenService', () => {
  let service: ImagesFullscreenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImagesFullscreenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
