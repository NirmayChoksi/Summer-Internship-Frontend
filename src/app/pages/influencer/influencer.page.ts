import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonIcon, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, megaphoneOutline, personOutline } from 'ionicons/icons';
import { TabOptions } from 'src/app/shared/models/interfaces';
import { Auth } from '../auth/services/auth';
import { InfluencerProfileService } from './profile/services/influencer-profile';

@Component({
  selector: 'app-influencer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './influencer.page.html',
  styleUrls: ['./influencer.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonIcon, IonTabBar, IonTabButton, IonTabs],
})
export class InfluencerPage implements OnInit {
  private authService = inject(Auth);
  private profileService = inject(InfluencerProfileService);

  tabs = signal<TabOptions[]>([
    { label: 'Home', icon: 'home-outline', route: 'home' },
    { label: 'Campaigns', icon: 'megaphone-outline', route: 'campaigns' },
    { label: 'Profile', icon: 'person-outline', route: 'profile' },
  ]);

  constructor() {
    addIcons({ homeOutline, personOutline, megaphoneOutline });
  }

  ngOnInit() {
    const existingProfile = this.profileService.profile();
    const isProfileComplete = this.authService.isProfileComplete();

    if (isProfileComplete && !existingProfile)
      this.profileService.getInfluencerProfileByUserId().subscribe();
  }
}
