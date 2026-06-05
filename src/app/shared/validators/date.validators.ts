import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateRangeValidator(minDate?: Date, maxDate?: Date): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) return null;

    const date = new Date(value);

    if (isNaN(date.getTime())) return { invalidDate: true };

    if (minDate && date < minDate) return { minDate: { minDate, actualDate: date } };

    if (maxDate && date > maxDate) return { maxDate: { maxDate, actualDate: date } };

    return null;
  };
}

export function endDateAfterStartDateValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const startDate = group.get('startDate')?.value;
    const endDate = group.get('endDate')?.value;

    if (!startDate || !endDate) {
      return null;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return null;
    }

    return end > start ? null : { endDateBeforeStartDate: true };
  };
}
