import { Component, OnInit } from '@angular/core';
import { IonCard, IonCardHeader, IonSkeletonText, IonCardContent } from "@ionic/angular/standalone";

@Component({
  selector: 'app-active-campaigns-skeleton',
  templateUrl: './active-campaigns-skeleton.component.html',
  styleUrls: ['./active-campaigns-skeleton.component.scss'],
  imports: [IonCard, IonCardHeader, IonSkeletonText, IonCardContent],
})
export class ActiveCampaignsSkeletonComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
