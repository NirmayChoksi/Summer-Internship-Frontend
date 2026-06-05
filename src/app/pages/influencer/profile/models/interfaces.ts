import { Niche, Platform } from './enums';

type PlatformName = Lowercase<Platform>;

export interface PlatformStats {
  username: string;
  followers: number;
}

type Platforms = Partial<Record<PlatformName, PlatformStats>>;

export interface InfluencerProfile {
  _id: string;
  user: string;
  bio: string;
  niche: Niche[];
  country: string;
  platforms: Platforms;
  pastWorks: string[];
  firstName: string;
  lastName: string;
  isVerified: boolean;
}

export type CreateInfluencerProfile = Omit<InfluencerProfile, '_id' | 'user' | 'isVerified'>;

export type UpdateInfluencerProfile = Partial<CreateInfluencerProfile>;
