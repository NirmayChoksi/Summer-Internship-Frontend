import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RecentApplicationsSkeletonComponent } from './recent-applications-skeleton.component';

describe('RecentApplicationsSkeletonComponent', () => {
  let component: RecentApplicationsSkeletonComponent;
  let fixture: ComponentFixture<RecentApplicationsSkeletonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RecentApplicationsSkeletonComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RecentApplicationsSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
