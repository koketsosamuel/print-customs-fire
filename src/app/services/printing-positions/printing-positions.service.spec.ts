import { TestBed } from '@angular/core/testing';

import { PrintingPositionsService } from './printing-positions.service';

describe('PrintingPositionsService', () => {
  let service: PrintingPositionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrintingPositionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
