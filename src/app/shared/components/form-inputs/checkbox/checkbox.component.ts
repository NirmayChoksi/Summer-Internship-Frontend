import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  CheckboxCustomEvent,
  IonCheckbox,
  IonIcon,
  IonLabel,
  IonNote,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { alertCircleOutline } from 'ionicons/icons';
import { FormValueAccessor } from 'src/app/shared/utils/form-value-accessor';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
  imports: [IonCheckbox, IonIcon, IonLabel, IonNote],
})
export class CheckboxComponent extends FormValueAccessor<boolean> {
  constructor() {
    super();
    addIcons({ alertCircleOutline });
  }

  onChange(e: CheckboxCustomEvent): void {
    this.markTouched();
    this.setValue(e.detail.checked);
  }
}
