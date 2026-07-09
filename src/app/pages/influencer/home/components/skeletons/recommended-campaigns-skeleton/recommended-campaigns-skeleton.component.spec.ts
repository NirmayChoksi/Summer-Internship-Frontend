import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RecommendedCampaignsSkeletonComponent } from './recommended-campaigns-skeleton.component';

describe('RecommendedCampaignsSkeletonComponent', () => {
  let component: RecommendedCampaignsSkeletonComponent;
  let fixture: ComponentFixture<RecommendedCampaignsSkeletonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RecommendedCampaignsSkeletonComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RecommendedCampaignsSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
