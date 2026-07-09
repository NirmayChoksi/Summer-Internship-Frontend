import { Component, computed, input } from '@angular/core';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonIcon,
  IonRow,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eyeOutline, heartOutline, imagesOutline, trendingUpOutline } from 'ionicons/icons';
import { Insights } from '../../../models/interfaces';

@Component({
  selector: 'app-insights-card',
  templateUrl: './insights-card.component.html',
  styleUrls: ['./insights-card.component.scss'],
  imports: [IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol, IonIcon],
})
export class InsightsCardComponent {
  readonly insights = input.required<Insights>();
  readonly reach = computed(() => this.format(this.insights().totalReach));
  readonly impressions = computed(() => this.format(this.insights().totalImpressions));
  readonly engagement = computed(() => this.format(this.insights().totalEngagement));

  constructor() {
    addIcons({
      eyeOutline,
      trendingUpOutline,
      heartOutline,
      imagesOutline,
    });
  }

  private format(value: number) {
    return Intl.NumberFormat('en', {
      maximumFractionDigits: 1,
    }).format(value);
  }
}
