import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonIcon, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, personOutline } from 'ionicons/icons';
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

  constructor() {
    addIcons({ homeOutline, personOutline });
  }

  ngOnInit() {
    const userId = this.authService.user()?._id;
    const existingProfile = this.profileService.profile();

    if (userId && !existingProfile)
      this.profileService.getInfluencerProfileByUserId(userId).subscribe();
  }
}
