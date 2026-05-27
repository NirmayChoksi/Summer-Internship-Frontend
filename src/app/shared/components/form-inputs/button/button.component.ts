import { Component, computed, input, OnInit } from '@angular/core';
import { IonIcon, IonSpinner, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
// import * as allIcons from 'ionicons/icons';

export type ButtonFill = 'solid' | 'outline' | 'ghost' | 'clear';
export type ButtonColor =
  | 'primary'
  | 'danger'
  | 'success'
  | 'warning'
  | 'medium'
  | 'light'
  | 'dark';
export type ButtonExpand = 'block' | 'full' | undefined;
export type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  imports: [IonIcon, IonSpinner, IonButton],
})
export class ButtonComponent {
  // Content
  label = input<string>('');
  iconStart = input<string>('');
  iconEnd = input<string>('');
  iconOnly = input<boolean>(false);

  // Appearance
  fill = input<ButtonFill>('solid');
  color = input<ButtonColor>('primary');
  expand = input<ButtonExpand>('block');
  shape = input<'round' | undefined>(undefined);

  // State
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  type = input<ButtonType>('button');

  // ghost maps to Ionic's 'clear'
  ionFill = computed(() => (this.fill() === 'ghost' ? 'clear' : this.fill()));

  // Disable while loading
  isDisabled = computed(() => this.disabled() || this.loading());

  constructor() {}
}
