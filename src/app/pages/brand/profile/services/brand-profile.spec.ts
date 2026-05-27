import { TestBed } from '@angular/core/testing';

import { BrandProfile } from './brand-profile';

describe('BrandProfile', () => {
  let service: BrandProfile;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrandProfile);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
