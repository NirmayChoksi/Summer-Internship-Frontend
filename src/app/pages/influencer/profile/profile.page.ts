import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from '@angular/core';
import {
  FormArray,
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
import { finalize } from 'rxjs';
import { ButtonComponent } from 'src/app/shared/components/form-inputs/button/button.component';
import { InputComponent } from 'src/app/shared/components/form-inputs/input/input.component';
import {
  SelectComponent,
  SelectOption,
} from 'src/app/shared/components/form-inputs/select/select.component';
import { TextAreaComponent } from 'src/app/shared/components/form-inputs/text-area/text-area.component';
import { atLeastOneSocialValidator } from 'src/app/shared/validators/social-platform.validator';
import { Auth } from '../../auth/services/auth';
import { Country, Niche } from './models/enums';
import { CreateInfluencerProfile, InfluencerProfile } from './models/interfaces';
import { InfluencerProfileService } from './services/influencer-profile';
import { platformNames } from 'src/app/shared/utils/platform-names';

@Component({
  selector: 'influencer-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    ButtonComponent,
    CommonModule,
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
  authService = inject(Auth);
  private fb = inject(FormBuilder);
  private influencerProfileService = inject(InfluencerProfileService);

  countryOptions: SelectOption[] = Object.entries(Country).map(([key, value]) => {
    return { label: key, value };
  });
  isEditMode = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  nicheOptions: SelectOption[] = Object.entries(Niche).map(([key, value]) => {
    return { label: key, value };
  });
  profileForm!: FormGroup;
  profileId?: string;
  platformOptions = signal<{ label: string; value: string }[]>(
    platformNames.map((value) => ({ label: value[0].toUpperCase() + value.slice(1), value })),
  );

  constructor() {
    addIcons({ alertCircleOutline });

    effect(() => {
      const profile = this.influencerProfileService.profile();

      if (profile) {
        this.isEditMode.set(true);
        this.profileId = profile._id;
        this.patchForm(profile);
      }
    });
  }

  ngOnInit() {
    this.profileForm = this.createProfileForm();
    this.addPastWork();
  }

  createProfileForm() {
    return this.fb.group({
      bio: ['', Validators.required],
      niche: [[], Validators.required],
      country: ['', Validators.required],
      platforms: this.createPlatformsGroup(),
      pastWorks: this.fb.array([]),
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: [
        {
          value: this.authService.user()?.email,
          disabled: true,
        },
      ],
    });
  }

  private patchForm(profile: InfluencerProfile) {
    const platformValues = Object.fromEntries(
      platformNames.map((platform) => [
        platform,
        {
          username: profile.platforms?.[platform]?.username ?? '',
          followers: profile.platforms?.[platform]?.followers ?? 0,
        },
      ]),
    );

    this.profileForm.patchValue({
      bio: profile.bio,
      niche: profile.niche,
      country: profile.country,
      platforms: platformValues,
      firstName: profile.firstName,
      lastName: profile.lastName,
    });

    this.pastWorks.clear();

    if (profile.pastWorks?.length) {
      profile.pastWorks.forEach((url: string) => {
        this.pastWorks.push(this.fb.control(url, Validators.required));
      });
    } else {
      this.addPastWork();
    }
  }

  get pastWorks() {
    return this.profileForm.get('pastWorks') as FormArray;
  }

  private createPlatformsGroup() {
    const controls = Object.fromEntries(
      platformNames.map((platform) => [platform, this.createSocialGroup()]),
    );

    return this.fb.group(controls, {
      validators: atLeastOneSocialValidator(),
    });
  }

  //TODO: Auto-populate followers based on username input
  private createSocialGroup() {
    return this.fb.group({
      username: [''],
      followers: [{ value: 0 }],
    });
  }

  addPastWork() {
    this.pastWorks.push(this.fb.control('', Validators.required));
  }

  removePastWork(index: number) {
    if (this.pastWorks.length === 1) return;

    this.pastWorks.removeAt(index);
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();

      return;
    }

    this.isLoading.set(true);

    const value = this.profileForm.getRawValue();

    const payload = this.buildPayload(value);

    const request =
      this.isEditMode() && this.profileId
        ? this.influencerProfileService.updateInfluencerProfile(this.profileId, payload)
        : this.influencerProfileService.createInfluencerProfile(payload);

    request.pipe(finalize(() => this.isLoading.set(false))).subscribe({
      next: () => {
        console.log(
          this.isEditMode() ? 'Profile updated successfully' : 'Profile created successfully',
        );
      },
      error: (err) => console.error(err),
    });
  }

  private buildPayload(value: any): CreateInfluencerProfile {
    const platforms = Object.fromEntries(
      Object.entries(value.platforms)
        .filter(([, data]: any) => data.username)
        .map(([name, data]: any) => [
          name,
          {
            ...data,
            followers: Number(data.followers),
          },
        ]),
    );

    return {
      ...value,
      platforms,
    };
  }
}
