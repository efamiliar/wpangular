import { TestBed } from '@angular/core/testing';

import { WprestNoAuthService } from './wprest-no-auth.service';

describe('WprestNoAuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WprestNoAuthService = TestBed.get(WprestNoAuthService);
    expect(service).toBeTruthy();
  });
});
