import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonButtons,
  IonCard,
  IonCardContent,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonItemDivider,
  IonLabel,
  IonModal,
  IonNote,
  IonProgressBar,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addOutline,
  alertCircleOutline,
  checkmarkOutline,
  closeOutline,
  logoInstagram,
  logoTwitter,
  logoYoutube,
  pencilOutline,
  trashBinOutline,
} from 'ionicons/icons';
import { finalize } from 'rxjs';
import { CampaignCardComponent } from 'src/app/shared/components/cards/campaign-card/campaign-card.component';
import { ButtonComponent } from 'src/app/shared/components/form-inputs/button/button.component';
import { DatePickerComponent } from 'src/app/shared/components/form-inputs/date-picker/date-picker.component';
import { InputComponent } from 'src/app/shared/components/form-inputs/input/input.component';
import {
  SelectComponent,
  SelectOption,
} from 'src/app/shared/components/form-inputs/select/select.component';
import { TextAreaComponent } from 'src/app/shared/components/form-inputs/text-area/text-area.component';
import { CampaignStatus, InfluencerCampaignStatus, Platform } from 'src/app/shared/models/enums';
import { BrandCampaign, CreateCampaign } from 'src/app/shared/models/interfaces';
import { CampaignService } from 'src/app/shared/services/campaign';
import {
  dateRangeValidator,
  endDateAfterStartDateValidator,
} from 'src/app/shared/validators/date.validators';
import { Industry } from '../profile/models/enums';
import { BrandProfile } from '../profile/models/interfaces';
import { BrandProfileService } from '../profile/services/brand-profile';

@Component({
  selector: 'app-brand-campaigns',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './campaigns.page.html',
  styleUrls: ['./campaigns.page.scss'],
  standalone: true,
  imports: [
    IonNote,
    IonItemDivider,
    IonIcon,
    IonProgressBar,
    IonCardContent,
    IonCard,
    IonChip,
    ButtonComponent,
    CampaignCardComponent,
    CommonModule,
    DatePickerComponent,
    FormsModule,
    InputComponent,
    IonButtons,
    IonContent,
    IonHeader,
    IonLabel,
    IonModal,
    IonSpinner,
    IonText,
    IonTitle,
    IonToolbar,
    ReactiveFormsModule,
    SelectComponent,
    TextAreaComponent,
  ],
})
export class CampaignsPage {
  private brandProfileService = inject(BrandProfileService);
  private campaignService = inject(CampaignService);
  private fb = inject(FormBuilder);

  isCampaignFormModalOpen = signal<boolean>(false);
  isCampaignDetailsModalOpen = signal<boolean>(false);
  campaignForm!: FormGroup;
  industryOptions: SelectOption[] = Object.entries(Industry).map(([key, value]) => ({
    label: key,
    value,
  }));
  platformOptions: SelectOption[] = Object.entries(Platform).map(([key, value]) => ({
    label: key,
    value,
  }));
  isEditMode = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  today = signal<string>(new Date().toISOString().split('T')[0]);
  profile: BrandProfile | null = null;
  campaigns = signal<BrandCampaign[]>([]);
  isLoadingCampaigns = signal<boolean>(false);
  selectedCampaign = signal<BrandCampaign | null>(null);
  influencerStatus = InfluencerCampaignStatus;
  campaignStatus = CampaignStatus;

  constructor() {
    addIcons({
      addOutline,
      alertCircleOutline,
      checkmarkOutline,
      closeOutline,
      logoInstagram,
      logoTwitter,
      logoYoutube,
      pencilOutline,
      trashBinOutline,
    });

    effect(() => {
      const profile = this.brandProfileService.profile();

      if (!profile) return;

      this.profile = profile;

      this.loadCampaigns();
    });
  }

  private loadCampaigns() {
    if (!this.profile) return;

    this.isLoadingCampaigns.set(true);

    this.campaignService
      .getCampaignsByBrandId(this.profile._id)
      .pipe(finalize(() => this.isLoadingCampaigns.set(false)))
      .subscribe({
        next: ({ campaigns }) => {
          this.campaigns.set(campaigns);
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  openCampaignFormModal() {
    this.isEditMode.set(false);

    if (!this.campaignForm) this.campaignForm = this.initializeCampaignForm();
    else this.campaignForm.reset();

    this.isCampaignFormModalOpen.set(true);
  }

  closeCampaignFormModal() {
    this.isCampaignFormModalOpen.set(false);
    this.isEditMode.set(false);
  }

  openCampaignDetailsModal(id: string) {
    const campaign = this.campaigns().find((c) => c._id === id);

    this.selectedCampaign.set(campaign ?? null);
    this.isCampaignDetailsModalOpen.set(true);
  }

  closeCampaignDetailsModal() {
    this.isCampaignDetailsModalOpen.set(false);
  }

  editCampaign() {
    const campaign = this.selectedCampaign();

    if (!campaign) return;

    if (!this.campaignForm) this.campaignForm = this.initializeCampaignForm();
    else this.campaignForm.reset();

    this.campaignForm.patchValue({
      title: campaign.title,
      industry: campaign.industry,
      description: campaign.description,
      platforms: campaign.platforms,
      payout: campaign.payout,
      endDate: campaign.endDate,
      maximumInfluencers: campaign.maximumInfluencers,
    });

    this.isEditMode.set(true);

    this.closeCampaignDetailsModal();
    this.isCampaignFormModalOpen.set(true);
  }

  deleteCampaign() {
    const campaign = this.selectedCampaign();

    if (!campaign) return;

    this.isLoading.set(true);

    this.campaignService
      .deleteCampaign(campaign._id)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.campaigns.update((campaigns) => campaigns.filter((c) => c._id !== campaign._id));

          this.closeCampaignDetailsModal();
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  async canDismiss(_data?: undefined, role?: string) {
    return role !== 'gesture';
  }

  initializeCampaignForm() {
    return this.fb.group(
      {
        title: ['', [Validators.required, Validators.minLength(5)]],
        industry: ['', [Validators.required]],
        description: ['', [Validators.required, Validators.minLength(20)]],
        platforms: [[], [Validators.required]],
        payout: [0, [Validators.required, Validators.min(0)]],
        startDate: [null, [Validators.required, dateRangeValidator(new Date())]],
        endDate: [null, [Validators.required, dateRangeValidator(new Date())]],
        maximumInfluencers: [0, [Validators.required, Validators.min(1)]],
      },
      {
        validators: [endDateAfterStartDateValidator()],
      },
    );
  }

  onSubmit() {
    if (this.campaignForm.invalid) {
      this.campaignForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const payload = this.buildPayload(this.campaignForm.getRawValue());

    const selectedCampaign = this.selectedCampaign();

    const request =
      this.isEditMode() && selectedCampaign
        ? this.campaignService.updateCampaign(selectedCampaign._id, payload)
        : this.campaignService.createCampaign(payload);

    request.pipe(finalize(() => this.isLoading.set(false))).subscribe({
      next: ({ campaign }) => {
        if (this.isEditMode())
          this.campaigns.update((campaigns) =>
            campaigns.map((c) => (c._id === campaign._id ? campaign : c)),
          );
        else this.campaigns.update((campaigns) => [campaign, ...campaigns]);

        this.closeCampaignFormModal();
      },
      error: (err) => console.error(err),
    });
  }

  private buildPayload(value: any): CreateCampaign {
    return {
      ...value,
      payout: Number(value.payout),
      maximumInfluencers: Number(value.maximumInfluencers),
    };
  }

  changeInfluencerStatus(influencerId: string, status: InfluencerCampaignStatus) {
    const campaign = this.selectedCampaign();

    if (!campaign) return;

    this.campaignService
      .changeInfluencerStatus(campaign._id, {
        influencerId,
        status,
      })
      .subscribe({
        next: ({ campaign: updatedCampaign }) => {
          this.selectedCampaign.set(updatedCampaign);

          this.campaigns.update((campaigns) =>
            campaigns.map((campaign) =>
              campaign._id === updatedCampaign._id ? updatedCampaign : campaign,
            ),
          );
        },
        error: (err) => console.error(err),
      });
  }
}
