import { Component } from '@angular/core';
import { IonCard, IonItem, IonList, IonLabel, IonSkeletonText, IonChip } from "@ionic/angular/standalone";

@Component({
  selector: 'app-applications-card-skeleton',
  templateUrl: './applications-card-skeleton.component.html',
  styleUrls: ['./applications-card-skeleton.component.scss'],
  imports: [IonCard, IonItem, IonList, IonLabel, IonSkeletonText, IonChip],
})
export class ApplicationsCardSkeletonComponent {}
