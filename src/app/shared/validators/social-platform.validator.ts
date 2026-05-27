import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function atLeastOneSocialValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const instagram = control.get('instagram.username')?.value;
    const twitter = control.get('twitter.username')?.value;
    const youtube = control.get('youtube.username')?.value;

    const hasAtLeastOne = !!instagram || !!twitter || !!youtube;

    return hasAtLeastOne ? null : { atLeastOneSocial: true };
  };
}
