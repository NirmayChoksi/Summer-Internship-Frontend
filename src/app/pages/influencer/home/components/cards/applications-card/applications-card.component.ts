import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import {
  IonBadge,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronForwardOutline } from 'ionicons/icons';
import { InfluencerCampaignStatus } from 'src/app/shared/models/enums';
import { MyApplication } from '../../../models/interfaces';

@Component({
  selector: 'app-applications-card',
  templateUrl: './applications-card.component.html',
  styleUrls: ['./applications-card.component.scss'],
  imports: [
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonBadge,
    IonIcon,
    DecimalPipe,
    DatePipe,
  ],
})
export class ApplicationsCardComponent {
  readonly applications = input.required<MyApplication[]>();

  readonly applicationSelected = output<string>();

  constructor() {
    addIcons({
      chevronForwardOutline,
    });
  }

  open(application: MyApplication) {
    this.applicationSelected.emit(application._id);
  }

  badgeColor(status: InfluencerCampaignStatus) {
    switch (status) {
      case InfluencerCampaignStatus.Accepted:
        return 'success';

      case InfluencerCampaignStatus.Rejected:
        return 'danger';

      default:
        return 'warning';
    }
  }
}
