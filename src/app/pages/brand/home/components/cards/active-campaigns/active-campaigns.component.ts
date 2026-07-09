import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonIcon,
  IonProgressBar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowForwardOutline, calendarOutline, peopleOutline } from 'ionicons/icons';
import { ActiveCampaigns } from '../../../models/interfaces';

@Component({
  selector: 'app-active-campaigns',
  templateUrl: './active-campaigns.component.html',
  styleUrls: ['./active-campaigns.component.scss'],
  imports: [
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonProgressBar,
    IonButton,
    IonChip,
    IonIcon,
    DatePipe,
    DecimalPipe,
  ],
})
export class ActiveCampaignsComponent {
  readonly campaigns = input.required<ActiveCampaigns[]>();

  readonly campaignSelected = output<string>();

  readonly viewAll = output<void>();

  constructor() {
    addIcons({
      arrowForwardOutline,
      peopleOutline,
      calendarOutline,
    });
  }

  progress(campaign: ActiveCampaigns) {
    if (!campaign.maximumInfluencers) return 0;

    return campaign.acceptedInfluencersCount / campaign.maximumInfluencers;
  }

  open(id: string) {
    this.campaignSelected.emit(id);
  }
}
