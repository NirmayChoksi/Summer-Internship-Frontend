import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { IonCard, IonCardContent, IonChip, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowForwardOutline, calendarOutline, cashOutline, sparklesOutline } from 'ionicons/icons';
import { ButtonComponent } from 'src/app/shared/components/form-inputs/button/button.component';
import { RecommendedCampaign } from '../../../models/interfaces';

@Component({
  selector: 'app-recommended-campaigns',
  templateUrl: './recommended-campaigns.component.html',
  styleUrls: ['./recommended-campaigns.component.scss'],
  imports: [IonCard, IonCardContent, IonChip, IonIcon, DecimalPipe, DatePipe, ButtonComponent],
})
export class RecommendedCampaignsComponent {
  readonly campaigns = input.required<RecommendedCampaign[]>();

  constructor() {
    addIcons({
      arrowForwardOutline,
      cashOutline,
      calendarOutline,
      sparklesOutline,
    });
  }

  apply(id: string) {
    console.log(id);
  }

  browseCampaigns() {
    // Navigate to campaign listing
  }
}
