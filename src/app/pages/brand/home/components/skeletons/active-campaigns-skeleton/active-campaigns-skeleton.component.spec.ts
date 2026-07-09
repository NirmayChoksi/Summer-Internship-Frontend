import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ActiveCampaignsSkeletonComponent } from './active-campaigns-skeleton.component';

describe('ActiveCampaignsSkeletonComponent', () => {
  let component: ActiveCampaignsSkeletonComponent;
  let fixture: ComponentFixture<ActiveCampaignsSkeletonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ActiveCampaignsSkeletonComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ActiveCampaignsSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
