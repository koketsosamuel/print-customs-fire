import { TestBed } from '@angular/core/testing';

import { PrintingMethodsService } from './printing-methods.service';

describe('PrintingMethodsService', () => {
  let service: PrintingMethodsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrintingMethodsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
