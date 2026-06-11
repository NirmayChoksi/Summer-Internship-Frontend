import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonNote,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { alertCircleOutline } from 'ionicons/icons';
import { finalize, of, switchMap } from 'rxjs';
import { ButtonComponent } from 'src/app/shared/components/form-inputs/button/button.component';
import { FileUploadComponent } from 'src/app/shared/components/form-inputs/file-upload/file-upload.component';
import { InputComponent } from 'src/app/shared/components/form-inputs/input/input.component';
import {
  SelectComponent,
  SelectOption,
} from 'src/app/shared/components/form-inputs/select/select.component';
import { TextAreaComponent } from 'src/app/shared/components/form-inputs/text-area/text-area.component';
import { Upload } from 'src/app/shared/services/upload';
import { budgetValidator } from 'src/app/shared/validators/budget.validator';
import { Auth } from '../../auth/services/auth';
import { Industry } from './models/enums';
import { BrandProfile, CreateBrandProfile } from './models/interfaces';
import { BrandProfileService } from './services/brand-profile';

@Component({
  selector: 'brand-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    ButtonComponent,
    CommonModule,
    FileUploadComponent,
    FormsModule,
    InputComponent,
    IonContent,
    IonHeader,
    IonIcon,
    IonLabel,
    IonNote,
    IonTitle,
    IonToolbar,
    ReactiveFormsModule,
    SelectComponent,
    TextAreaComponent,
  ],
})
export class ProfilePage implements OnInit {
  private authService = inject(Auth);
  private brandProfileService = inject(BrandProfileService);
  private fb = inject(FormBuilder);
  private uploadService = inject(Upload);

  companyLogoFile: File | null = null;
  companyLogoUrl = signal<string | null>(null);
  industryOptions: SelectOption[] = Object.entries(Industry).map(([key, value]) => ({
    label: key,
    value,
  }));
  isEditMode = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  profileForm!: FormGroup;
  profileId?: string;

  constructor() {
    addIcons({ alertCircleOutline });

    effect(() => {
      const profile = this.brandProfileService.profile();

      if (profile) {
        this.isEditMode.set(true);
        this.profileId = profile._id;
        this.companyLogoUrl.set(profile.companyLogoUrl);
        this.patchForm(profile);
      }
    });
  }

  ngOnInit() {
    this.profileForm = this.createProfileForm();
  }

  createProfileForm() {
    return this.fb.group({
      companyLogo: [null],
      companyName: ['', [Validators.required]],
      description: ['', [Validators.required]],
      website: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+$/)]],
      industry: [[], [Validators.required]],
      budget: this.fb.group(
        {
          min: ['', [Validators.required, Validators.min(0)]],
          max: ['', [Validators.required, Validators.min(0)]],
        },
        {
          validators: budgetValidator(),
        },
      ),
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      contactNumber: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      email: [
        {
          value: this.authService.user()?.email,
          disabled: true,
        },
        [Validators.required, Validators.email],
      ],
    });
  }

  private patchForm(profile: BrandProfile) {
    this.profileForm.patchValue({
      companyLogo: profile.companyLogo,
      companyName: profile.companyName,
      description: profile.description,
      website: profile.website,
      industry: profile.industry,
      budget: profile.budget,
      firstName: profile.firstName,
      lastName: profile.lastName,
      contactNumber: profile.contactNumber,
    });
  }

  onCompanyLogoUpload(files: File[]) {
    this.companyLogoFile = files[0] ?? null;
  }

  onCompanyLogoRemoved(value: string | string[] | null) {
    this.companyLogoUrl.set(null);

    this.profileForm.patchValue({
      companyLogo: value,
    });
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const value = this.profileForm.getRawValue();

    const uploadRequest = this.companyLogoFile
      ? this.uploadService.uploadCompanyLogo(this.companyLogoFile)
      : of({
          url: typeof value.companyLogo === 'string' ? value.companyLogo : '',
        });

    uploadRequest
      .pipe(
        switchMap(({ url }) => {
          const payload = this.buildPayload(value, url);

          if (this.isEditMode() && this.profileId)
            return this.brandProfileService.updateBrandProfile(this.profileId, payload);

          return this.brandProfileService.createBrandProfile(payload);
        }),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: (res) => console.log(res),
        error: (err) => console.error(err),
      });
  }

  private buildPayload(value: any, logo: string): CreateBrandProfile {
    return {
      ...value,
      companyLogo: logo,
      budget: { min: Number(value.budget.min), max: Number(value.budget.max) },
    };
  }
}
