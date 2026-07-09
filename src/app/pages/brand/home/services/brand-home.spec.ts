import { TestBed } from '@angular/core/testing';

import { BrandHome } from './brand-home';

describe('BrandHome', () => {
  let service: BrandHome;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrandHome);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
