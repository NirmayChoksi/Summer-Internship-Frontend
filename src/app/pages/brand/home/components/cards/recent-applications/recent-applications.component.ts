import { Component, input, output } from '@angular/core';
import {
  IonAvatar,
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
import { arrowForwardOutline, personOutline } from 'ionicons/icons';
import { ButtonComponent } from 'src/app/shared/components/form-inputs/button/button.component';
import { InfluencerCampaignStatus } from 'src/app/shared/models/enums';
import { RecentApplications } from '../../../models/interfaces';

@Component({
  selector: 'app-recent-applications',
  templateUrl: './recent-applications.component.html',
  styleUrls: ['./recent-applications.component.scss'],
  imports: [
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonAvatar,
    IonBadge,
    IonIcon,
    ButtonComponent,
  ],
})
export class RecentApplicationsComponent {
  readonly applications = input.required<RecentApplications[]>();

  readonly applicationSelected = output<string>();

  readonly viewAll = output<void>();

  constructor() {
    addIcons({
      personOutline,
      arrowForwardOutline,
    });
  }

  open(application: RecentApplications) {
    this.applicationSelected.emit(application.campaignId);
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

  initials(application: RecentApplications) {
    return (application.influencer.firstName[0] + application.influencer.lastName[0]).toUpperCase();
  }

  followers(value: number) {
    return Intl.NumberFormat('en', {
      maximumFractionDigits: 1,
    }).format(value);
  }
}
