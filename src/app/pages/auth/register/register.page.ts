import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { finalize } from 'rxjs';
import { ButtonComponent } from 'src/app/shared/components/form-inputs/button/button.component';
import { InputComponent } from 'src/app/shared/components/form-inputs/input/input.component';
import {
  SelectComponent,
  SelectOption,
} from 'src/app/shared/components/form-inputs/select/select.component';
import { UserRole } from '../models/enums';
import { RegisterResponse } from '../models/interfaces';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-register',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    ButtonComponent,
    CommonModule,
    FormsModule,
    InputComponent,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    ReactiveFormsModule,
    RouterLink,
    SelectComponent,
  ],
})
export class RegisterPage implements OnInit {
  private authService = inject(Auth);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  isLoading = signal<boolean>(false);
  registrationForm!: FormGroup;
  roleOptions: SelectOption[] = Object.entries(UserRole).map(([key, value]) => {
    return { label: key, value };
  });

  constructor() {}

  ngOnInit() {
    this.registrationForm = this.createRegistrationForm();
  }

  createRegistrationForm() {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      role: [UserRole.Brand, [Validators.required]],
    });
  }

  onSubmit() {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();

      return;
    }

    this.isLoading.set(true);

    this.authService
      .register(this.registrationForm.getRawValue())
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (res) => {
          this.handleAuthFlow(res);
        },
        error: (err) => {
          console.error(err.error);
        },
      });
  }

  private handleAuthFlow(res: RegisterResponse) {
    const email = this.registrationForm.value.email;

    if (res.isProfileComplete || (res.isOtpVerified && res.isPasswordCreated)) {
      this.router.navigate(['/auth/login']);
      return;
    }

    if (res.isOtpVerified) {
      this.router.navigate(['/auth/create-password'], {
        queryParams: {
          id: res.id,
          email,
        },
      });
      return;
    }

    this.router.navigate(['/auth/verify-otp'], {
      queryParams: {
        id: res.id,
        email,
      },
    });
  }
}
