import { computed, DestroyRef, Directive, inject, Injector, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Directive()
export abstract class FormValueAccessor<T> implements ControlValueAccessor {
  label = input<string>('');
  placeholder = input<string>('');

  value = signal<T | null>(null);
  isDisabled = signal<boolean>(false);
  isTouched = signal<boolean>(false);

  private injector = inject(Injector);
  private destroyRef = inject(DestroyRef);

  protected get ngControl(): NgControl | null {
    return this.injector.get(NgControl, null, {
      self: true,
      optional: true,
    });
  }

  private validatorVersion = signal(0);

  errors = computed(() => {
    this.validatorVersion();
    const control = this.ngControl?.control;
    if (!control || !this.isTouched()) return null;
    return control.errors;
  });

  hasError = computed(() => !!this.errors());

  errorMessage = computed(() => {
    const errs = this.errors();

    if (!errs) return '';

    if (errs['required']) return `${this.label() || 'This field'} is required`;
    if (errs['email']) return 'Invalid email address';
    if (errs['minlength']) return `Minimum ${errs['minlength'].requiredLength} characters required`;
    if (errs['maxlength']) return `Maximum ${errs['maxlength'].requiredLength} characters allowed`;
    if (errs['min']) return `Minimum value is ${errs['min'].min}`;
    if (errs['max']) return `Maximum value is ${errs['max'].max}`;
    if (errs['pattern']) return 'Invalid format';

    return `Invalid value (${Object.keys(errs)[0]})`;
  });

  isRequired = computed(() => {
    this.validatorVersion();
    const control = this.ngControl?.control;
    if (!control?.validator) return false;
    const result = control.validator({ value: null } as any);
    return !!result?.['required'];
  });

  ngAfterViewInit(): void {
    this.ngControl?.control?.statusChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.validatorVersion.update((v) => v + 1);
      });
  }

  private _onChange = (val: T | null) => {};

  private _onTouched = () => {};

  writeValue(val: T): void {
    this.value.set(val ?? null);
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState(d: boolean) {
    this.isDisabled.set(d);
  }

  protected setValue(val: T): void {
    this.value.set(val);
    this._onChange(val);
  }

  protected markTouched(): void {
    this.isTouched.set(true);
    this._onTouched();
  }
}
