import { Component, computed, forwardRef, input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  IonIcon,
  IonLabel,
  IonNote,
  IonTextarea,
  TextareaCustomEvent,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { alertCircleOutline } from 'ionicons/icons';
import { FormValueAccessor } from 'src/app/shared/utils/form-value-accessor';

@Component({
  selector: 'app-text-area',
  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextAreaComponent),
      multi: true,
    },
  ],
  imports: [IonIcon, IonLabel, IonNote, IonTextarea],
})
export class TextAreaComponent extends FormValueAccessor<string> {
  rows = input<number>(4);
  maxlength = input<number | undefined>(undefined);
  showCounter = input<boolean>(false);

  constructor() {
    super();
    addIcons({ alertCircleOutline });
  }

  counterFormatter = (inputLength: number, maxLength: number): string => {
    const remaining = maxLength - inputLength;
    return `${inputLength} / ${maxLength}`;
  };

  isNearLimit = computed(() => {
    const max = this.maxlength();
    if (!max) return false;
    return (this.value()?.length ?? 0) >= max * 0.85;
  });

  isAtLimit = computed(() => {
    const max = this.maxlength();
    if (!max) return false;
    return (this.value()?.length ?? 0) >= max;
  });

  onInput(e: TextareaCustomEvent): void {
    this.setValue(e.detail.value ?? '');
  }

  onBlur(): void {
    this.markTouched();
  }
}
