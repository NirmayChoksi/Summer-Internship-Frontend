import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  InfiniteScrollCustomEvent,
  IonButtons,
  IonCard,
  IonCardContent,
  IonChip,
  IonContent,
  IonHeader,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonLabel,
  IonMenu,
  IonMenuToggle,
  IonModal,
  IonProgressBar,
  IonRange,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, enterOutline, exitOutline, filterCircleOutline } from 'ionicons/icons';
import { finalize } from 'rxjs';
import { CampaignCardComponent } from 'src/app/shared/components/cards/campaign-card/campaign-card.component';
import { ButtonComponent } from 'src/app/shared/components/form-inputs/button/button.component';
import { SelectOption } from 'src/app/shared/components/form-inputs/select/select.component';
import { CampaignStatus, InfluencerCampaignStatus } from 'src/app/shared/models/enums';
import { InfluencerCampaign } from 'src/app/shared/models/interfaces';
import { CampaignService } from 'src/app/shared/services/campaign';
import { Industry } from '../../brand/profile/models/enums';

@Component({
  selector: 'app-influencer-campaigns',
  templateUrl: './campaigns.page.html',
  styleUrls: ['./campaigns.page.scss'],
  standalone: true,
  imports: [
    ButtonComponent,
    CampaignCardComponent,
    CommonModule,
    FormsModule,
    IonButtons,
    IonCard,
    IonCardContent,
    IonChip,
    IonContent,
    IonHeader,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonLabel,
    IonMenu,
    IonMenuToggle,
    IonModal,
    IonProgressBar,
    IonRange,
    IonSpinner,
    IonText,
    IonTitle,
    IonToolbar,
  ],
})
export class CampaignsPage implements OnInit {
  private campaignService = inject(CampaignService);

  isCampaignDetailsModalOpen = signal<boolean>(false);
  campaigns = signal<InfluencerCampaign[]>([]);
  isLoadingCampaigns = signal<boolean>(false);
  selectedCampaign = signal<InfluencerCampaign | null>(null);
  campaignStatus = CampaignStatus;
  influencerStatus = InfluencerCampaignStatus;
  industryOptions = signal<SelectOption[]>([
    { label: 'All', value: null },
    ...Object.entries(Industry).map(([key, value]) => ({
      label: key,
      value,
    })),
  ]);
  selectedIndustry = signal<Industry | null>(null);
  budgetOption = signal<{ min: number; max: number }>({ min: 0, max: 100000 });
  selectedBudget = signal<{ lower: number; upper: number }>({ lower: 0, upper: 100000 });
  platformOptions = signal<SelectOption[]>([
    { label: 'All', value: null },
    { label: 'Instagram', value: 'Instagram' },
    { label: 'Twitter', value: 'Twitter' },
    { label: 'Youtube', value: 'Youtube' },
  ]);
  selectedPlatform = signal<string | null>(null);
  page = signal(1);
  limit = 10;
  hasNextPage = signal(true);
  isLoadingMore = signal(false);

  filters = computed(() => ({
    industry: this.selectedIndustry(),
    platform: this.selectedPlatform(),
    minPayout: this.selectedBudget().lower,
    maxPayout: this.selectedBudget().upper,
    page: this.page(),
    limit: this.limit,
  }));

  constructor() {
    addIcons({ closeOutline, exitOutline, enterOutline, filterCircleOutline });
  }

  ngOnInit(): void {
    this.loadCampaigns();
  }

  selectIndustry(value: Industry | null) {
    this.selectedIndustry.set(value);
  }

  selectPlatform(value: string | null) {
    this.selectedPlatform.set(value);
  }

  onBudgetChange(event: CustomEvent) {
    this.selectedBudget.set(
      event.detail.value as {
        lower: number;
        upper: number;
      },
    );
  }

  loadCampaigns() {
    this.isLoadingCampaigns.set(true);

    this.campaignService
      .getCampaigns(this.filters())
      .pipe(finalize(() => this.isLoadingCampaigns.set(false)))
      .subscribe({
        next: ({ campaigns, pagination }) => {
          this.campaigns.set(campaigns);

          this.hasNextPage.set(pagination.hasNextPage);
        },
        error: console.error,
      });
  }

  loadMoreCampaigns(event: InfiniteScrollCustomEvent) {
    if (!this.hasNextPage() || this.isLoadingMore()) {
      event?.target && (event.target as HTMLIonInfiniteScrollElement).complete();

      return;
    }

    this.isLoadingMore.set(true);

    const nextPage = this.page() + 1;

    this.campaignService
      .getCampaigns({
        ...this.filters(),
        page: nextPage,
      })
      .pipe(
        finalize(() => {
          this.isLoadingMore.set(false);
          event.target.complete();
        }),
      )
      .subscribe({
        next: ({ campaigns, pagination }) => {
          this.page.set(nextPage);

          this.campaigns.update((current) => [...current, ...campaigns]);

          this.hasNextPage.set(pagination.hasNextPage);
        },
        error: console.error,
      });
  }

  clearFilters() {
    this.selectedIndustry.set(null);
    this.selectedPlatform.set(null);

    this.selectedBudget.set({
      lower: this.budgetOption().min,
      upper: this.budgetOption().max,
    });

    this.page.set(1);

    this.loadCampaigns();
  }

  openCampaignDetailsModal(id: string) {
    const campaign = this.campaigns().find((c) => c._id === id);

    this.selectedCampaign.set(campaign ?? null);
    this.isCampaignDetailsModalOpen.set(true);
  }

  closeCampaignDetailsModal() {
    this.isCampaignDetailsModalOpen.set(false);
  }

  async canDismiss(_data?: undefined, role?: string) {
    return role !== 'gesture';
  }

  joinCampaign() {
    const campaign = this.selectedCampaign();

    if (!campaign) return;

    this.campaignService.joinCampaign(campaign._id).subscribe({
      next: ({ campaign }) => {
        this.campaigns.update((campaigns) =>
          campaigns.map((c) => (c._id === campaign._id ? campaign : c)),
        );

        this.selectedCampaign.set(campaign);
      },
      error: (err) => console.error(err),
    });
  }

  leaveCampaign() {
    const campaign = this.selectedCampaign();

    if (!campaign) return;

    this.campaignService.leaveCampaign(campaign._id).subscribe({
      next: ({ campaign }) => {
        this.campaigns.update((campaigns) =>
          campaigns.map((c) => (c._id === campaign._id ? campaign : c)),
        );

        this.selectedCampaign.set(campaign);
      },
      error: (err) => console.error(err),
    });
  }
}
