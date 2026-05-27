import { Component, forwardRef, input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonIcon, IonItem, IonLabel, IonNote, IonRadio, IonRadioGroup, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { alertCircleOutline } from 'ionicons/icons';
import { FormValueAccessor } from 'src/app/shared/utils/form-value-accessor';

export interface RadioOption {
  label: string;
  value: any;
}

@Component({
  selector: 'app-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioButtonComponent),
      multi: true,
    },
  ],
  imports: [IonIcon, IonItem, IonLabel, IonNote, IonRadio, IonRadioGroup, IonText],
})
export class RadioButtonComponent extends FormValueAccessor<any> {
  options = input<RadioOption[]>([]);

  constructor() {
    super();
    addIcons({ alertCircleOutline });
  }

  onSelect(e: any): void {
    this.markTouched();
    this.setValue(e.detail.value);
  }

  onBlur(): void {
    this.markTouched();
  }
}
