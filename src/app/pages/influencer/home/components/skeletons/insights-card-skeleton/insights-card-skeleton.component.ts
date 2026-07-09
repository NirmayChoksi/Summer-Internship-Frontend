import { Component } from '@angular/core';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCol,
  IonGrid,
  IonRow,
  IonSkeletonText,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-insights-card-skeleton',
  templateUrl: './insights-card-skeleton.component.html',
  styleUrls: ['./insights-card-skeleton.component.scss'],
  imports: [IonCard, IonCardHeader, IonSkeletonText, IonCardContent, IonRow, IonGrid, IonCol],
})
export class InsightsCardSkeletonComponent {}
