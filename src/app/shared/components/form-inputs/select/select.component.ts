import { Component, forwardRef, input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonIcon, IonLabel, IonNote, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { alertCircleOutline } from 'ionicons/icons';
import { FormValueAccessor } from 'src/app/shared/utils/form-value-accessor';

export interface SelectOption {
  label: string;
  value: any;
}

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  imports: [IonIcon, IonLabel, IonNote, IonSelect, IonSelectOption],
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent extends FormValueAccessor<any> {
  options = input<SelectOption[]>([]);
  multiple = input<boolean>(false);

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
