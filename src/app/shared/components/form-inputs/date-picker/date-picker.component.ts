import { Component, computed, forwardRef, input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  DatetimeChangeEventDetail,
  DatetimeCustomEvent,
  IonDatetime,
  IonDatetimeButton,
  IonIcon,
  IonLabel,
  IonModal,
  IonNote,
} from '@ionic/angular/standalone';
import { FormValueAccessor } from 'src/app/shared/utils/form-value-accessor';

export type PresentationMode =
  | 'date'
  | 'date-time'
  | 'month'
  | 'month-year'
  | 'time'
  | 'time-date'
  | 'year';

let counter = 0;

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true,
    },
  ],
  imports: [IonNote, IonIcon, IonLabel, IonDatetimeButton, IonModal, IonDatetime],
})
export class DatePickerComponent extends FormValueAccessor<string | string[]> implements OnInit {
  presentation = input<PresentationMode>('date-time');
  min = input<string | undefined>(undefined);
  max = input<string | undefined>(undefined);
  id!: string;

  formatOptions = computed(() => {
    switch (this.presentation()) {
      case 'date':
        return {
          date: { day: '2-digit', month: '2-digit', year: 'numeric' },
        };
      case 'date-time':
        return {
          date: { day: '2-digit', month: '2-digit', year: 'numeric' },
          time: { hour: '2-digit', minute: '2-digit', hour12: false },
        };
      case 'month':
      case 'month-year':
        return {
          date: { month: '2-digit', year: 'numeric' },
        };
      case 'time':
        return {
          time: { hour: '2-digit', minute: '2-digit', hour12: false },
        };
      case 'time-date':
        return {
          date: { day: '2-digit', month: '2-digit', year: 'numeric' },
          time: { hour: '2-digit', minute: '2-digit', hour12: false },
        };
      case 'year':
        return {
          date: { year: 'numeric' },
        };
    }
  });

  ngOnInit(): void {
    console.log(counter);
    this.id = `datetime-${counter}`;
    counter++;
  }

  onDateChange(e: DatetimeCustomEvent): void {
    const iso = e.detail.value;
    if (iso) this.setValue(iso);

    this.markTouched();
  }
}
