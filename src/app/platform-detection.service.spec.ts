import { TestBed } from '@angular/core/testing';

import { PlatformDetectionService } from './platform-detection.service';

describe('PlatformDetectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlatformDetectionService = TestBed.get(PlatformDetectionService);
    expect(service).toBeTruthy();
  });
});
