import { Component, computed, input } from '@angular/core';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonGrid, IonIcon, IonRow, IonProgressBar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  checkmarkCircleOutline,
  megaphoneOutline,
  peopleOutline,
  trophyOutline,
} from 'ionicons/icons';
import { CampaignOverview } from '../../../models/interfaces';

@Component({
  selector: 'app-overview-card',
  templateUrl: './overview-card.component.html',
  styleUrls: ['./overview-card.component.scss'],
  imports: [IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol, IonIcon, IonProgressBar],
})
export class OverviewCardComponent {
  readonly overview = input.required<CampaignOverview>();

  readonly acceptanceRate = computed(() => {
    const overview = this.overview();

    if (!overview.totalApplications) return 0;

    return Math.round((overview.acceptedApplications / overview.totalApplications) * 100);
  });

  constructor() {
    addIcons({
      megaphoneOutline,
      peopleOutline,
      checkmarkCircleOutline,
      trophyOutline,
    });
  }
}
