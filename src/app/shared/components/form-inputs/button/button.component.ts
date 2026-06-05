import { Component, computed, input } from '@angular/core';
import { IonButton, IonIcon, IonSpinner } from '@ionic/angular/standalone';

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
  imports: [IonButton, IonIcon, IonSpinner],
})
export class ButtonComponent {
  label = input<string>('');
  iconStart = input<string>('');
  iconEnd = input<string>('');
  iconOnly = input<boolean>(false);

  fill = input<ButtonFill>('solid');
  color = input<ButtonColor>('primary');
  expand = input<ButtonExpand>('block');
  shape = input<'round' | undefined>(undefined);

  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  type = input<ButtonType>('button');

  ionFill = computed(() => (this.fill() === 'ghost' ? 'clear' : this.fill()));

  isDisabled = computed(() => this.disabled() || this.loading());

  constructor() {}
}
