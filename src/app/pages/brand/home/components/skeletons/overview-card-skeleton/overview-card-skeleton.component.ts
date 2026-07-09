import { Component, OnInit } from '@angular/core';
import { IonCard, IonCardHeader, IonSkeletonText, IonCardContent, IonGrid, IonRow, IonCol } from "@ionic/angular/standalone";

@Component({
  selector: 'app-overview-card-skeleton',
  templateUrl: './overview-card-skeleton.component.html',
  styleUrls: ['./overview-card-skeleton.component.scss'],
  imports: [IonCard, IonCardHeader, IonSkeletonText, IonCardContent, IonGrid, IonRow, IonCol],
})
export class OverviewCardSkeletonComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
