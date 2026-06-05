import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { platformNames } from '../utils/platform-names';

export function atLeastOneSocialValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const hasAtLeastOne = platformNames.some(
      (platform) => !!control.get(`platforms.${platform}.username`)?.value,
    );

    return hasAtLeastOne ? null : { atLeastOneSocial: true };
  };
}
