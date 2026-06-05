import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonInputOtp,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { finalize, take } from 'rxjs';
import { ButtonComponent } from 'src/app/shared/components/form-inputs/button/button.component';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-verify-otp',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './verify-otp.page.html',
  styleUrls: ['./verify-otp.page.scss'],
  standalone: true,
  imports: [
    ButtonComponent,
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonInputOtp,
    IonText,
    IonTitle,
    IonToolbar,
    ReactiveFormsModule,
  ],
})
export class VerifyOtpPage implements OnInit {
  private authService = inject(Auth);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  email?: string;
  isResending = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  private userId?: string;
  verifyOtpForm!: FormGroup;

  constructor() {}

  ngOnInit() {
    this.verifyOtpForm = this.createVerifyOtpForm();

    this.route.queryParamMap.pipe(take(1)).subscribe((params) => {
      const id = params.get('id');
      if (id) this.userId = id;

      const email = params.get('email');
      if (email) this.email = email;
    });
  }

  createVerifyOtpForm() {
    return this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });
  }

  onSubmit() {
    if (this.verifyOtpForm.invalid || !this.userId) {
      this.verifyOtpForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const value = this.verifyOtpForm.getRawValue();

    this.authService
      .verifyOtp({ id: this.userId, otp: String(value.otp) })
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          this.router.navigate(['/auth/create-password'], {
            queryParams: { id: this.userId, email: this.email },
          });
        },
        error: (err) => console.error(err.error),
      });
  }

  resendOtp() {
    if (!this.email) return;

    this.isResending.set(true);

    this.authService
      .resendOtp(this.email)
      .pipe(finalize(() => this.isResending.set(false)))
      .subscribe({
        next: () => console.log('OTP resent successfully'),
        error: (err) => console.error(err.error),
      });
  }
}
