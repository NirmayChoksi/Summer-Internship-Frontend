import { InfluencerProfile } from 'src/app/pages/influencer/profile/models/interfaces';
import { InfluencerCampaignStatus } from 'src/app/shared/models/enums';
import { BrandCampaign } from 'src/app/shared/models/interfaces';
import { BrandProfile } from '../../profile/models/interfaces';

export interface BrandHome {
  profile: ProfileSummary;
  overview: CampaignOverview;
  activeCampaigns: ActiveCampaigns[];
  recentApplications: RecentApplications[];
}

export type ProfileSummary = Pick<
  BrandProfile,
  'companyName' | 'companyLogoUrl' | 'firstName' | 'lastName' | 'industry' | 'website'
>;

export type ActiveCampaigns = Pick<
  BrandCampaign,
  '_id' | 'title' | 'payout' | 'endDate' | 'acceptedInfluencersCount' | 'maximumInfluencers'
>;

export interface CampaignOverview {
  activeCampaigns: number;
  completedCampaigns: number;
  totalApplications: number;
  acceptedApplications: number;
}

export interface RecentApplications {
  campaignId: string;
  campaignTitle: string;
  status: InfluencerCampaignStatus;
  influencer: Pick<InfluencerProfile, '_id' | 'firstName' | 'lastName' | 'instagram'>;
}
