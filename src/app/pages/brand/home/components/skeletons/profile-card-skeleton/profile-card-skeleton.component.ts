import { Component, OnInit } from '@angular/core';
import { IonCard, IonCardContent, IonSkeletonText, IonAvatar, IonChip } from "@ionic/angular/standalone";

@Component({
  selector: 'brand-profile-card-skeleton',
  templateUrl: './profile-card-skeleton.component.html',
  styleUrls: ['./profile-card-skeleton.component.scss'],
  imports: [IonCard, IonCardContent, IonSkeletonText, IonAvatar, IonChip],
})
export class ProfileCardSkeletonComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
