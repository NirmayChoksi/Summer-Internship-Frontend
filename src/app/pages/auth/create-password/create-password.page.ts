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
  IonIcon,
  IonNote,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { alertCircleOutline } from 'ionicons/icons';
import { finalize, take } from 'rxjs';
import { ButtonComponent } from 'src/app/shared/components/form-inputs/button/button.component';
import { InputComponent } from 'src/app/shared/components/form-inputs/input/input.component';
import { passwordMatchValidator } from 'src/app/shared/validators/create-password.validator';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-create-password',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './create-password.page.html',
  styleUrls: ['./create-password.page.scss'],
  standalone: true,
  imports: [
    ButtonComponent,
    CommonModule,
    FormsModule,
    InputComponent,
    IonContent,
    IonHeader,
    IonIcon,
    IonNote,
    IonTitle,
    IonToolbar,
    ReactiveFormsModule,
  ],
})
export class CreatePasswordPage implements OnInit {
  private authService = inject(Auth);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  createPasswordForm!: FormGroup;
  isLoading = signal<boolean>(false);
  private userId?: string;

  constructor() {
    addIcons({ alertCircleOutline });
  }

  ngOnInit() {
    this.createPasswordForm = this.createForm();

    this.route.queryParamMap.pipe(take(1)).subscribe((params) => {
      const id = params.get('id');

      if (id) {
        this.userId = id;
      }
    });
  }

  createForm() {
    return this.fb.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@$!%*?&]).+$/),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: passwordMatchValidator() },
    );
  }

  onSubmit() {
    if (this.createPasswordForm.invalid || !this.userId) {
      this.createPasswordForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const value = this.createPasswordForm.getRawValue();

    this.authService
      .createPassword({
        id: this.userId,
        password: value.password,
        confirmPassword: value.confirmPassword,
      })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => this.router.navigate(['/auth/login']),
        error: (err) => console.error(err.error),
      });
  }
}
