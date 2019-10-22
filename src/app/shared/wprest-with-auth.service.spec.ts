import { TestBed } from '@angular/core/testing';

import { WprestWithAuthService } from './wprest-with-auth.service';

describe('WprestWithAuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WprestWithAuthService = TestBed.get(WprestWithAuthService);
    expect(service).toBeTruthy();
  });
});
