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
import { Auth } from '../services/auth';

@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
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
export class LoginPage implements OnInit {
  private authService = inject(Auth);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  isLoading = signal<boolean>(false);
  loginForm!: FormGroup;
  roleOptions: SelectOption[] = Object.entries(UserRole).map(([key, value]) => {
    return { label: key, value };
  });

  constructor() {}

  ngOnInit() {
    this.loginForm = this.createLoginForm();
  }

  createLoginForm() {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@$!%*?&]).+$/),
        ],
      ],
      role: [UserRole.Brand, [Validators.required]],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();

      return;
    }

    this.isLoading.set(true);

    this.authService
      .login(this.loginForm.getRawValue())
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (res) => {
          this.navigateUser(res.user.role);
        },
        error: (err) => {
          console.error(err.error);
        },
      });
  }

  private navigateUser(role: UserRole) {
    switch (role) {
      case UserRole.Brand:
        this.router.navigate(['/brand']);
        break;
      case UserRole.Influencer:
        this.router.navigate(['/influencer']);
        break;
    }
  }
}
