import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton } from '@ionic/angular/standalone';
import { CheckboxGroupComponent } from 'src/app/shared/components/form-inputs/checkbox-group/checkbox-group.component';
import { CheckboxComponent } from 'src/app/shared/components/form-inputs/checkbox/checkbox.component';
import { InputComponent } from 'src/app/shared/components/form-inputs/input/input.component';
import { RadioButtonComponent } from 'src/app/shared/components/form-inputs/radio-button/radio-button.component';
import { SelectComponent } from 'src/app/shared/components/form-inputs/select/select.component';
import { TextAreaComponent } from 'src/app/shared/components/form-inputs/text-area/text-area.component';
import { FileUploadComponent } from 'src/app/shared/components/form-inputs/file-upload/file-upload.component';

@Component({
  selector: 'app-kitchen-sink',
  templateUrl: './kitchen-sink.page.html',
  styleUrls: ['./kitchen-sink.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputComponent,
    SelectComponent,
    CheckboxComponent,
    CheckboxGroupComponent,
    RadioButtonComponent,
    TextAreaComponent,
    IonButton,
    FileUploadComponent,
  ],
})
export class KitchenSinkPage {
  private fb = inject(FormBuilder);

  submitted = false;

  countryOptions = [
    { label: 'United States', value: 'us' },
    { label: 'United Kingdom', value: 'uk' },
    { label: 'Canada', value: 'ca' },
    { label: 'Australia', value: 'au' },
    { label: 'Germany', value: 'de' },
  ];

  levelOptions = [
    { label: 'Beginner', value: 'beginner' },
    { label: 'Intermediate', value: 'intermediate' },
    { label: 'Advanced', value: 'advanced' },
  ];

  interestOptions = [
    { label: 'Technology', value: 'tech' },
    { label: 'Sports', value: 'sports' },
    { label: 'Music', value: 'music' },
    { label: 'Travel', value: 'travel' },
    { label: 'Food', value: 'food' },
  ];

  form = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    age: [null, [Validators.required, Validators.min(18), Validators.max(120)]],

    country: ['', Validators.required],
    bio: ['', [Validators.required, Validators.maxLength(200)]],

    level: ['', Validators.required],
    interests: [[]],

    terms: [false, Validators.requiredTrue],
    newsletter: [false],
  });

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) this.submitted = true;
  }

  onReset(): void {
    this.submitted = false;
    this.form.reset({
      fullName: '',
      email: '',
      password: '',
      age: null,
      country: '',
      bio: '',
      level: '',
      interests: null,
      terms: false,
      newsletter: false,
    });
  }
}
