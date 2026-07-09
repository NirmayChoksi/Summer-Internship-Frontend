import { TestBed } from '@angular/core/testing';

import { InfluencerHome } from './influencer-home';

describe('InfluencerHome', () => {
  let service: InfluencerHome;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InfluencerHome);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
