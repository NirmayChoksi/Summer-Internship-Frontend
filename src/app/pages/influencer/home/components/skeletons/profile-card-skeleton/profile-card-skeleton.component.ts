import { Component } from '@angular/core';
import { IonCard, IonCardContent, IonSkeletonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-profile-card-skeleton',
  templateUrl: './profile-card-skeleton.component.html',
  styleUrls: ['./profile-card-skeleton.component.scss'],
  imports: [IonCard, IonCardContent, IonSkeletonText],
})
export class ProfileCardSkeletonComponent {}
