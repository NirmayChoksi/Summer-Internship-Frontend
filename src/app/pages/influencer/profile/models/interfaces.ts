import { Niche } from './enums';

export interface PlatformStats {
  username: string;
  followers: number;
  token?: string;
}

export interface InfluencerProfile {
  _id: string;
  user: string;
  bio: string;
  niche: Niche[];
  country: string;
  instagram: PlatformStats;
  twitter?: PlatformStats;
  youtube?: PlatformStats;
  pastWorks: string[];
  firstName: string;
  lastName: string;
  isVerified: boolean;
}

export type CreateInfluencerProfile = Omit<InfluencerProfile, '_id' | 'user' | 'isVerified'>;

export type UpdateInfluencerProfile = Partial<CreateInfluencerProfile>;
