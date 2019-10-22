import { TestBed } from '@angular/core/testing';

import { DynamicGlobalsService } from './dynamic-globals.service';

describe('DynamicGlobalsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DynamicGlobalsService = TestBed.get(DynamicGlobalsService);
    expect(service).toBeTruthy();
  });
});
