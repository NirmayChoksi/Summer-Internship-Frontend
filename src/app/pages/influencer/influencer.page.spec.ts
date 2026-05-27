import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InfluencerPage } from './influencer.page';

describe('InfluencerPage', () => {
  let component: InfluencerPage;
  let fixture: ComponentFixture<InfluencerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InfluencerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
