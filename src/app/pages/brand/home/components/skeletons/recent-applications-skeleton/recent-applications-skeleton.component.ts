import { Component, OnInit } from '@angular/core';
import { IonCard, IonCardHeader, IonSkeletonText, IonCardContent, IonList, IonItem, IonLabel, IonAvatar, IonChip } from "@ionic/angular/standalone";

@Component({
  selector: 'app-recent-applications-skeleton',
  templateUrl: './recent-applications-skeleton.component.html',
  styleUrls: ['./recent-applications-skeleton.component.scss'],
  imports: [IonCard, IonCardHeader, IonSkeletonText, IonCardContent, IonList, IonItem, IonLabel, IonAvatar, IonChip],
})
export class RecentApplicationsSkeletonComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
