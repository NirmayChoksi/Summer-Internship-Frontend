import { Component, computed, input } from '@angular/core';
import { IonCard, IonCardContent, IonChip, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircle } from 'ionicons/icons';
import { ProfileSummary } from '../../../models/interfaces';

@Component({
  selector: 'influencer-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss'],
  imports: [IonCard, IonCardContent, IonIcon, IonChip, IonLabel],
})
export class ProfileCardComponent {
  readonly profile = input.required<ProfileSummary>();

  readonly fullName = computed(() => `${this.profile().firstName} ${this.profile().lastName}`);

  constructor() {
    addIcons({
      checkmarkCircle,
    });
  }
}
