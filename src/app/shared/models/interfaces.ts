import { Industry } from 'src/app/pages/brand/profile/models/enums';
import { BrandProfile } from 'src/app/pages/brand/profile/models/interfaces';
import { InfluencerProfile } from 'src/app/pages/influencer/profile/models/interfaces';
import { CampaignStatus, InfluencerCampaignStatus, Platform } from './enums';

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface TabOptions {
  icon: string;
  label: string;
  route: string;
}

export interface CampaignInfluencer {
  profile: Omit<InfluencerProfile, 'user'>;
  status: InfluencerCampaignStatus;
}

export interface Campaign {
  _id: string;
  brand: Omit<BrandProfile, 'user'>;
  title: string;
  industry: Industry;
  description: string;
  platforms: Platform[];
  payout: number;
  startDate: string;
  endDate: string;
  maximumInfluencers: number;
  acceptedInfluencersCount: number;
  status: CampaignStatus;
}

export interface BrandCampaign extends Campaign {
  influencers: CampaignInfluencer[];
}

export interface InfluencerCampaign extends Campaign {
  myApplication: CampaignInfluencer | null;
}

export type CreateCampaign = Omit<
  BrandCampaign,
  '_id' | 'brand' | 'acceptedInfluencersCount' | 'status' | 'influencers'
>;

export type UpdateCampaign = Partial<CreateCampaign>;

export interface ChangeInfluencerStatus {
  influencerId: string;
  status: InfluencerCampaignStatus;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
