import { Component, computed, input } from '@angular/core';
import { IonAvatar, IonCard, IonCardContent, IonChip } from '@ionic/angular/standalone';
import { ProfileSummary } from '../../../models/interfaces';

@Component({
  selector: 'brand-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss'],
  imports: [IonCard, IonCardContent, IonChip, IonAvatar],
})
export class ProfileCardComponent {
  readonly profile = input.required<ProfileSummary>();

  readonly contactName = computed(() => `${this.profile().firstName} ${this.profile().lastName}`);

  readonly website = computed(() => {
    try {
      return new URL(this.profile().website).hostname.replace('www.', '');
    } catch {
      return this.profile().website;
    }
  });
}
