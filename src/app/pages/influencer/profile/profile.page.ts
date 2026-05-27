import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, OnInit } from '@angular/core';
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

@Component({
  selector: 'influencer-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonNote,
    ButtonComponent,
    CommonModule,
    FormsModule,
    InputComponent,
    IonContent,
    IonHeader,
    IonLabel,
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
  isEditMode = false;
  isLoading = false;
  nicheOptions: SelectOption[] = Object.entries(Niche).map(([key, value]) => {
    return { label: key, value };
  });
  profileForm!: FormGroup;
  profileId?: string;

  constructor() {
    addIcons({ alertCircleOutline });

    effect(() => {
      const profile = this.influencerProfileService.profile();

      if (profile) {
        this.isEditMode = true;
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
    return this.fb.group(
      {
        bio: ['', Validators.required],
        niche: [[], Validators.required],
        country: ['', Validators.required],
        instagram: this.createSocialGroup(),
        twitter: this.createSocialGroup(),
        youtube: this.createSocialGroup(),
        pastWorks: this.fb.array([]),
        email: [
          {
            value: this.authService.user()?.email,
            disabled: true,
          },
        ],
      },
      {
        validators: atLeastOneSocialValidator(),
      },
    );
  }

  private patchForm(profile: InfluencerProfile) {
    this.profileForm.patchValue({
      bio: profile.bio,
      niche: profile.niche,
      country: profile.country,
      instagram: {
        username: profile.instagram?.username ?? '',
        followers: profile.instagram?.followers ?? 0,
      },
      twitter: {
        username: profile.twitter?.username ?? '',
        followers: profile.twitter?.followers ?? 0,
      },
      youtube: {
        username: profile.youtube?.username ?? '',
        followers: profile.youtube?.followers ?? 0,
      },
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

  //TODO: Auto-populate followers based on username input
  private createSocialGroup() {
    return this.fb.group({
      username: [''],
      followers: [{ value: 10, disabled: true }],
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
    const userId = this.authService.user()?._id;

    if (!userId) return;

    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();

      return;
    }

    this.isLoading = true;

    const value = this.profileForm.getRawValue();

    const payload = this.buildPayload(value);

    const request =
      this.isEditMode && this.profileId
        ? this.influencerProfileService.updateInfluencerProfile(this.profileId, payload)
        : this.influencerProfileService.createInfluencerProfile(userId, payload);

    request
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe({
        next: () => {
          console.log(
            this.isEditMode ? 'Profile updated successfully' : 'Profile created successfully',
          );
        },
        error: (err) => console.error(err),
      });
  }

  private buildPayload(value: any): CreateInfluencerProfile {
    return {
      bio: value.bio,
      niche: value.niche,
      country: value.country,
      instagram: value.instagram.username
        ? { ...value.instagram, followers: Number(value.instagram.followers) }
        : undefined,
      twitter: value.twitter.username
        ? { ...value.twitter, followers: Number(value.twitter.followers) }
        : undefined,
      youtube: value.youtube.username
        ? { ...value.youtube, followers: Number(value.youtube.followers) }
        : undefined,
      pastWorks: value.pastWorks,
    };
  }
}
