import { Industry } from './enums';

export interface Budget {
  min: number;
  max: number;
}

export interface BrandProfile {
  _id: string;
  user: any;
  companyLogo: string;
  companyName: string;
  description: string;
  website: string;
  industry: Industry[];
  budget: Budget;
  firstName: string;
  lastName: string;
  contactNumber: string;
}

export type CreateBrandProfile = Omit<BrandProfile, '_id' | 'user'>;

export type UpdateBrandProfile = Partial<BrandProfile>;
