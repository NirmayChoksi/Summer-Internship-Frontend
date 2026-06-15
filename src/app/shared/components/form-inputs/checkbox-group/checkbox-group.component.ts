import { Component, computed, forwardRef, input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  CheckboxCustomEvent,
  IonCheckbox,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { alertCircleOutline } from 'ionicons/icons';
import { FormValueAccessor } from 'src/app/shared/utils/form-value-accessor';

export interface CheckboxOption {
  label: string;
  value: any;
}

@Component({
  selector: 'app-checkbox-group',
  templateUrl: './checkbox-group.component.html',
  styleUrls: ['./checkbox-group.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxGroupComponent),
      multi: true,
    },
  ],
  imports: [IonCheckbox, IonIcon, IonItem, IonLabel, IonList, IonNote, IonText],
})
export class CheckboxGroupComponent extends FormValueAccessor<any[]> {
  options = input<CheckboxOption[]>([]);

  constructor() {
    super();
    addIcons({ alertCircleOutline });
  }

  override writeValue(val: any[]): void {
    this.value.set(val ?? []);
  }

  isChecked = computed(() => (val: any) => {
    return (this.value() ?? []).includes(val);
  });

  onCheck(e: CheckboxCustomEvent, optValue: any): void {
    const current = [...(this.value() ?? [])];

    if (e.detail.checked) {
      if (!current.includes(optValue)) {
        this.setValue([...current, optValue]);
      }
    } else {
      this.setValue(current.filter((v) => v !== optValue));
    }
  }

  onBlur(): void {
    this.markTouched();
  }
}
