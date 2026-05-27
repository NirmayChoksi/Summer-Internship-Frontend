import { AbstractControl } from '@angular/forms';

export function budgetValidator(control: AbstractControl) {
  const min = control.get('min')?.value;

  const max = control.get('max')?.value;

  if (min != null && max != null && min > max) {
    return { invalidBudget: true };
  }

  return null;
}
