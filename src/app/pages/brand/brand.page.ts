import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonIcon, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, personOutline } from 'ionicons/icons';
import { Auth } from '../auth/services/auth';
import { BrandProfileService } from './profile/services/brand-profile';

@Component({
  selector: 'app-brand',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './brand.page.html',
  styleUrls: ['./brand.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonIcon, IonTabBar, IonTabButton, IonTabs],
})
export class BrandPage implements OnInit {
  private authService = inject(Auth);
  private profileService = inject(BrandProfileService);

  constructor() {
    addIcons({ homeOutline, personOutline });
  }

  ngOnInit() {
    const userId = this.authService.user()?._id;
    const isProfileComplete = this.authService.isProfileComplete();
    const existingProfile = this.profileService.profile();

    if (userId && isProfileComplete && !existingProfile)
      this.profileService.getBrandProfileByUserId(userId).subscribe();
  }
}
