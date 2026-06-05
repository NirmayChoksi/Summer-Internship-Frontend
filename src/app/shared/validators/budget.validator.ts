import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function budgetValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const min = control.get('min')?.value as number | null;
    const max = control.get('max')?.value as number | null;

    return min != null && max != null && min > max ? { invalidBudget: true } : null;
  };
}
