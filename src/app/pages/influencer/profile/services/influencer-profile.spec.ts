import { TestBed } from '@angular/core/testing';

import { InfluencerProfile } from './influencer-profile';

describe('InfluencerProfile', () => {
  let service: InfluencerProfile;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InfluencerProfile);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
