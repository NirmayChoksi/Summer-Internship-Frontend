import { Component } from '@angular/core';
import { IonButton, IonCard, IonCardContent, IonSkeletonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-recommended-campaigns-skeleton',
  templateUrl: './recommended-campaigns-skeleton.component.html',
  styleUrls: ['./recommended-campaigns-skeleton.component.scss'],
  imports: [IonCard, IonCardContent, IonSkeletonText, IonButton],
})
export class RecommendedCampaignsSkeletonComponent {}
