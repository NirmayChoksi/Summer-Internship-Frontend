import { InfluencerCampaign } from 'src/app/shared/models/interfaces';
import { InfluencerProfile } from '../../profile/models/interfaces';

export interface InfluencerHome {
  profile: ProfileSummary;
  recommendedCampaigns: RecommendedCampaign[];
  myApplications: MyApplication[];
  insights: Insights;
}

export type ProfileSummary = Pick<
  InfluencerProfile,
  'firstName' | 'lastName' | 'instagram' | 'niche' | 'isVerified'
>;

export type RecommendedCampaign = Pick<
  InfluencerCampaign,
  '_id' | 'title' | 'description' | 'industry' | 'platforms' | 'payout' | 'endDate' | 'brand'
>;

export type MyApplication = Pick<
  InfluencerCampaign,
  '_id' | 'brand' | 'title' | 'payout' | 'endDate' | 'status' | 'myApplication'
>;

export interface Insights {
  totalPosts: number;
  totalReach: number;
  totalImpressions: number;
  totalEngagement: number;
  averageReach: number;
  averageImpressions: number;
  averageEngagement: number;
  media: any;
}
