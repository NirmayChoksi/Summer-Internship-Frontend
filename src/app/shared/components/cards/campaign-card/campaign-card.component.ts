import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonIcon,
  IonText,
  IonProgressBar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { people, timeOutline } from 'ionicons/icons';
import { Campaign } from 'src/app/shared/models/interfaces';
import { DaysLeftPipe } from 'src/app/shared/pipes/days-left-pipe';

@Component({
  selector: 'app-campaign-card',
  templateUrl: './campaign-card.component.html',
  styleUrls: ['./campaign-card.component.scss'],
  imports: [
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonChip,
    TitleCasePipe,
    IonCardContent,
    IonText,
    IonIcon,
    DaysLeftPipe,
    IonProgressBar,
    CurrencyPipe,
  ],
})
export class CampaignCardComponent implements OnInit {
  campaign = input<Campaign>();

  constructor() {
    addIcons({ timeOutline, people });
  }

  ngOnInit() {}
}
