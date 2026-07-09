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
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonHeader, IonLabel, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { alertCircleOutline, logoInstagram, refreshOutline } from 'ionicons/icons';
import { finalize, take } from 'rxjs';
import { ButtonComponent } from 'src/app/shared/components/form-inputs/button/button.component';
import { InputComponent } from 'src/app/shared/components/form-inputs/input/input.component';
import {
  SelectComponent,
  SelectOption,
} from 'src/app/shared/components/form-inputs/select/select.component';
import { TextAreaComponent } from 'src/app/shared/components/form-inputs/text-area/text-area.component';
import { SocialMedia } from 'src/app/shared/services/social-media';
import { Auth } from '../../auth/services/auth';
import { Country, Niche } from './models/enums';
import {
  CreateInfluencerProfile,
  InfluencerProfile,
  UpdateInfluencerProfile,
} from './models/interfaces';
import { InfluencerProfileService } from './services/influencer-profile';

@Component({
  selector: 'app-influencer-profile',
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
    IonLabel,
    IonTitle,
    IonToolbar,
    ReactiveFormsModule,
    SelectComponent,
    TextAreaComponent,
  ],
})
export class ProfilePage implements OnInit {
  private authService = inject(Auth);
  private fb = inject(FormBuilder);
  private influencerProfileService = inject(InfluencerProfileService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private socialMediaService = inject(SocialMedia);

  countryOptions: SelectOption[] = Object.entries(Country).map(([key, value]) => ({
    label: key,
    value,
  }));

  nicheOptions: SelectOption[] = Object.entries(Niche).map(([key, value]) => ({
    label: key,
    value,
  }));

  isEditMode = signal(false);
  isLoading = signal(false);

  profileForm!: FormGroup;
  profileId?: string;

  constructor() {
    addIcons({ alertCircleOutline, logoInstagram, refreshOutline });

    effect(() => {
      const profile = this.influencerProfileService.profile();

      if (!profile || !this.profileForm) return;

      this.isEditMode.set(true);
      this.profileId = profile._id;

      const tokenControl = this.profileForm.get('instagram.token');
      tokenControl?.clearValidators();
      tokenControl?.updateValueAndValidity();

      const userIdControl = this.profileForm.get('instagram.userId');
      userIdControl?.clearValidators();
      userIdControl?.updateValueAndValidity();

      this.patchForm(profile);
    });
  }

  ngOnInit() {
    this.profileForm = this.createProfileForm();
    this.addPastWork();

    this.handleInstagramCallback();
  }

  ionViewWillEnter() {
    const profile = this.influencerProfileService.profile();

    if (profile) {
      this.patchForm(profile);
    }
  }

  get pastWorks(): FormArray {
    return this.profileForm.get('pastWorks') as FormArray;
  }

  addPastWork(url?: string) {
    this.pastWorks.push(this.fb.control(url ?? '', Validators.required));
  }

  removePastWork(index: number) {
    if (this.pastWorks.length === 1) return;

    this.pastWorks.removeAt(index);
  }

  connectInstagram() {
    localStorage.setItem('profileFormDraft', JSON.stringify(this.profileForm.getRawValue()));

    this.socialMediaService.getInstagramAccessToken();
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const value = this.profileForm.getRawValue();

    const request =
      this.isEditMode() && this.profileId
        ? this.influencerProfileService.updateInfluencerProfile(
            this.profileId,
            this.buildUpdatePayload(value),
          )
        : this.influencerProfileService.createInfluencerProfile(this.buildCreatePayload(value));

    request.pipe(finalize(() => this.isLoading.set(false))).subscribe({
      next: () => {
        console.log(
          this.isEditMode() ? 'Profile updated successfully' : 'Profile created successfully',
        );
      },
      error: (err) => console.error(err),
    });
  }

  refreshInstagramFollowers() {
    this.influencerProfileService.refreshInstagramFollowers().subscribe({
      next: ({ followers }) => {
        this.profileForm.patchValue({
          instagram: {
            followers,
          },
        });
      },
    });
  }

  private createProfileForm() {
    return this.fb.group({
      bio: ['', Validators.required],
      niche: [[], Validators.required],
      country: ['', Validators.required],

      instagram: this.fb.group({
        username: [{ value: '', disabled: true }, Validators.required],
        followers: [{ value: 0, disabled: true }, Validators.required],
        token: ['', Validators.required],
        userId: ['', Validators.required],
      }),

      twitter: this.createSocialGroup(),
      youtube: this.createSocialGroup(),

      pastWorks: this.fb.array([]),

      firstName: ['', Validators.required],
      lastName: ['', Validators.required],

      email: [
        {
          value: this.authService.user()?.email,
          disabled: true,
        },
      ],
    });
  }

  private createSocialGroup() {
    return this.fb.group({
      username: [{ value: '', disabled: true }],
      followers: [{ value: 0, disabled: true }],
      token: [''],
    });
  }

  private handleInstagramCallback() {
    this.route.queryParamMap.pipe(take(1)).subscribe((params) => {
      const code = params.get('code');
      const state = params.get('state');
      const error = params.get('error');

      if (error || !code) {
        console.error('Instagram auth failed', error);
        this.clearQueryParams();
        return;
      }

      if (state !== sessionStorage.getItem('ig_oauth_state')) {
        console.error('State mismatch');
        this.clearQueryParams();
        return;
      }

      this.socialMediaService
        .exchangeCode(code)
        .pipe(finalize(() => this.clearQueryParams()))
        .subscribe({
          next: ({ profile, token }) => {
            const draft = localStorage.getItem('profileFormDraft');

            if (draft) {
              this.profileForm.patchValue(JSON.parse(draft));
              localStorage.removeItem('profileFormDraft');
            }

            this.profileForm.patchValue({
              instagram: {
                followers: profile.followers,
                token,
                userId: profile.id,
                username: profile.username,
              },
            });

            sessionStorage.removeItem('ig_oauth_state');
          },
          error: (err) => console.error(err),
        });
    });
  }

  private clearQueryParams() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
      replaceUrl: true,
    });
  }

  private patchForm(profile: InfluencerProfile) {
    this.profileForm.reset();

    this.profileForm.patchValue({
      bio: profile.bio,
      niche: profile.niche,
      country: profile.country,
      instagram: profile.instagram,
      twitter: profile.twitter ?? {},
      youtube: profile.youtube ?? {},
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: this.authService.user()?.email,
    });

    this.pastWorks.clear();

    if (profile.pastWorks?.length) {
      profile.pastWorks.forEach((url) => this.addPastWork(url));
    } else {
      this.addPastWork();
    }
  }

  private buildCreatePayload(value: any): CreateInfluencerProfile {
    return {
      ...value,
      instagram: {
        ...value.instagram,
        followers: Number(value.instagram.followers),
      },
      twitter: value.twitter?.username
        ? {
            ...value.twitter,
            followers: Number(value.twitter.followers),
          }
        : undefined,
      youtube: value.youtube?.username
        ? {
            ...value.youtube,
            followers: Number(value.youtube.followers),
          }
        : undefined,
    };
  }

  private buildUpdatePayload(value: any): UpdateInfluencerProfile {
    return {
      ...value,
      twitter: value.twitter?.username
        ? {
            ...value.twitter,
            followers: Number(value.twitter.followers),
          }
        : undefined,
      youtube: value.youtube?.username
        ? {
            ...value.youtube,
            followers: Number(value.youtube.followers),
          }
        : undefined,
    };
  }
}
