import { TestBed } from '@angular/core/testing';

import { CustomizationPreviewDialogService } from './customization-preview-dialog.service';

describe('CustomizationPreviewDialogService', () => {
  let service: CustomizationPreviewDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomizationPreviewDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
