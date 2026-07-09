import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { ApplicationsCardComponent } from './components/cards/applications-card/applications-card.component';
import { InsightsCardComponent } from './components/cards/insights-card/insights-card.component';
import { ProfileCardComponent } from './components/cards/profile-card/profile-card.component';
import { RecommendedCampaignsComponent } from './components/cards/recommended-campaigns/recommended-campaigns.component';
import { ApplicationsCardSkeletonComponent } from './components/skeletons/applications-card-skeleton/applications-card-skeleton.component';
import { InsightsCardSkeletonComponent } from './components/skeletons/insights-card-skeleton/insights-card-skeleton.component';
import { ProfileCardSkeletonComponent } from './components/skeletons/profile-card-skeleton/profile-card-skeleton.component';
import { RecommendedCampaignsSkeletonComponent } from './components/skeletons/recommended-campaigns-skeleton/recommended-campaigns-skeleton.component';
import { InfluencerHome } from './models/interfaces';
import { InfluencerHomeService } from './services/influencer-home';

@Component({
  selector: 'app-influencer-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    ReactiveFormsModule,
    IonRefresher,
    IonRefresherContent,
    ProfileCardSkeletonComponent,
    InsightsCardSkeletonComponent,
    RecommendedCampaignsSkeletonComponent,
    ApplicationsCardSkeletonComponent,
    ProfileCardComponent,
    InsightsCardComponent,
    RecommendedCampaignsComponent,
    ApplicationsCardComponent,
  ],
})
export class HomePage implements OnInit {
  private homeService = inject(InfluencerHomeService);

  home = signal<InfluencerHome | null>(null);
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
}
