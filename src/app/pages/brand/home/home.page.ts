import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  RefresherCustomEvent,
} from '@ionic/angular/standalone';
import { finalize } from 'rxjs';
import { ActiveCampaignsComponent } from './components/cards/active-campaigns/active-campaigns.component';
import { OverviewCardComponent } from './components/cards/overview-card/overview-card.component';
import { ProfileCardComponent } from './components/cards/profile-card/profile-card.component';
import { RecentApplicationsComponent } from './components/cards/recent-applications/recent-applications.component';
import { ActiveCampaignsSkeletonComponent } from './components/skeletons/active-campaigns-skeleton/active-campaigns-skeleton.component';
import { OverviewCardSkeletonComponent } from './components/skeletons/overview-card-skeleton/overview-card-skeleton.component';
import { ProfileCardSkeletonComponent } from './components/skeletons/profile-card-skeleton/profile-card-skeleton.component';
import { RecentApplicationsSkeletonComponent } from './components/skeletons/recent-applications-skeleton/recent-applications-skeleton.component';
import { BrandHome } from './models/interfaces';
import { BrandHomeService } from './services/brand-home';

@Component({
  selector: 'app-brand-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonRefresher,
    IonRefresherContent,
    ProfileCardSkeletonComponent,
    OverviewCardSkeletonComponent,
    ActiveCampaignsSkeletonComponent,
    RecentApplicationsSkeletonComponent,
    RecentApplicationsComponent,
    ActiveCampaignsComponent,
    OverviewCardComponent,
    ProfileCardComponent,
  ],
})
export class HomePage implements OnInit {
  private homeService = inject(BrandHomeService);
  private router = inject(Router);

  home = signal<BrandHome | null>(null);
  isLoading = signal(false);

  constructor() {}

  ngOnInit(): void {
    this.loadHome();
  }

  loadHome() {
    this.isLoading.set(true);

    this.homeService
      .getHome()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (res) => this.home.set(res.data),
        error: (error) => console.error(error),
      });
  }

  refresh(event: RefresherCustomEvent) {
    this.homeService
      .getHome()
      .pipe(finalize(() => event.target.complete()))
      .subscribe({
        next: (response) => {
          this.home.set(response.data);
        },
      });
  }

  openCampaign(id: string) {
    // this.router.navigate(['/brand/campaign', id]);
  }

  viewAllCampaigns() {
    this.router.navigate(['/brand/campaign']);
  }

  viewAllApplications() {
    // this.router.navigate(['/brand/applications']);
  }
}
