import { Component, forwardRef, input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  IonIcon,
  IonInput,
  IonInputPasswordToggle,
  IonLabel,
  IonNote,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { alertCircleOutline } from 'ionicons/icons';
import { FormValueAccessor } from 'src/app/shared/utils/form-value-accessor';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  imports: [IonIcon, IonInput, IonInputPasswordToggle, IonLabel, IonNote, IonNote],
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent extends FormValueAccessor<string> {
  type = input<'text' | 'email' | 'password' | 'number' | 'tel' | 'url'>('text');
  inputMode = input<'decimal' | 'email' | 'numeric' | 'tel' | 'text' | 'url'>('text');

  constructor() {
    super();
    addIcons({ alertCircleOutline });
  }

  onInput(e: Event): void {
    this.setValue((e.target as HTMLInputElement).value);
  }

  onBlur(): void {
    this.markTouched();
  }
}
