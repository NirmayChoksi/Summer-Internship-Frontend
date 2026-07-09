import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { Auth } from 'src/app/pages/auth/services/auth';
import { environment } from 'src/environments/environment';
import { InfluencerEndpoints } from '../../models/constants';
import {
  CreateInfluencerProfile,
  InfluencerProfile,
  UpdateInfluencerProfile,
} from '../models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class InfluencerProfileService {
  private authService = inject(Auth);
  private http = inject(HttpClient);

  private baseUrl = `${environment.baseUrl}${InfluencerEndpoints.base}${InfluencerEndpoints.profile.base}`;

  profile = signal<InfluencerProfile | null>(null);

  createInfluencerProfile(data: CreateInfluencerProfile) {
    return this.http
      .post<{ message: string; profile: InfluencerProfile }>(`${this.baseUrl}`, data)
      .pipe(
        tap(({ profile }) => {
          this.profile.set(profile);

          this.authService.updateUser({
            isProfileComplete: true,
          });
        }),
      );
  }

  getInfluencerProfileById(profileId: string) {
    return this.http
      .get<{ message: string; profile: InfluencerProfile }>(`${this.baseUrl}/${profileId}`)
      .pipe(tap(({ profile }) => this.profile.set(profile)));
  }

  getInfluencerProfileByUserId() {
    return this.http
      .get<{
        message: string;
        profile: InfluencerProfile;
      }>(`${this.baseUrl}${InfluencerEndpoints.profile.user}`)
      .pipe(tap(({ profile }) => this.profile.set(profile)));
  }

  refreshInstagramFollowers() {
    return this.http.patch<{ followers: number }>(
      `${this.baseUrl}${InfluencerEndpoints.profile.syncInstagramFollowers}`,
      {},
    );
  }

  updateInfluencerProfile(profileId: string, data: UpdateInfluencerProfile) {
    return this.http
      .patch<{ message: string; profile: InfluencerProfile }>(`${this.baseUrl}/${profileId}`, data)
      .pipe(tap(({ profile }) => this.profile.set(profile)));
  }
}
