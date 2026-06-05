import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CampaignEndpoints } from '../models/constants';
import {
  BrandCampaign,
  Campaign,
  ChangeInfluencerStatus,
  CreateCampaign,
  InfluencerCampaign,
  Pagination,
  UpdateCampaign,
} from '../models/interfaces';

@Injectable({ providedIn: 'root' })
export class CampaignService {
  private http = inject(HttpClient);

  private baseUrl = `${environment.baseUrl}${CampaignEndpoints.base}`;

  createCampaign(data: CreateCampaign) {
    return this.http.post<{ message: string; campaign: BrandCampaign }>(`${this.baseUrl}`, data);
  }

  getCampaigns(filters?: {
    industry?: string | null;
    platform?: string | null;
    minPayout?: number;
    maxPayout?: number;
    page?: number;
    limit?: number;
  }) {
    const params: Record<string, string> = {};
    Object.entries(filters ?? {}).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params[key] = String(value);
      }
    });

    return this.http.get<{
      message: string;
      campaigns: InfluencerCampaign[];
      pagination: Pagination;
    }>(`${this.baseUrl}`, { params });
  }

  getCampaignById(campaignId: string) {
    return this.http.get<{ message: string; campaign: Campaign }>(`${this.baseUrl}/${campaignId}`);
  }

  getCampaignsByBrandId(brandId: string) {
    return this.http.get<{ message: string; campaigns: BrandCampaign[] }>(
      `${this.baseUrl}${CampaignEndpoints.getCampaignsByBrandId}/${brandId}`,
    );
  }

  getCampaignsByInfluencerId(influencerId: string) {
    return this.http.get<{ message: string; campaigns: Campaign[] }>(
      `${this.baseUrl}/${CampaignEndpoints.getCampaignsByInfluencerId}/${influencerId}`,
    );
  }

  joinCampaign(campaignId: string) {
    return this.http.post<{ message: string; campaign: InfluencerCampaign }>(
      `${this.baseUrl}/${campaignId}${CampaignEndpoints.applications}`,
      {},
    );
  }

  leaveCampaign(campaignId: string) {
    return this.http.delete<{ message: string; campaign: InfluencerCampaign }>(
      `${this.baseUrl}/${campaignId}${CampaignEndpoints.applications}`,
    );
  }

  changeInfluencerStatus(campaignId: string, data: ChangeInfluencerStatus) {
    return this.http.patch<{ message: string; campaign: BrandCampaign }>(
      `${this.baseUrl}/${campaignId}${CampaignEndpoints.influencerStatus}`,
      data,
    );
  }

  updateCampaign(campaignId: string, data: UpdateCampaign) {
    return this.http.patch<{ message: string; campaign: BrandCampaign }>(
      `${this.baseUrl}/${campaignId}`,
      data,
    );
  }

  deleteCampaign(campaignId: string) {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${campaignId}`);
  }
}
