import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { InfluencerEndpoints } from '../../models/constants';
import {
  CreateInfluencerProfile,
  InfluencerProfile,
  UpdateInfluencerProfile,
} from '../models/interfaces';
import { tap } from 'rxjs';
import { Auth } from 'src/app/pages/auth/services/auth';

@Injectable({
  providedIn: 'root',
})
export class InfluencerProfileService {
  private authService = inject(Auth);
  private http = inject(HttpClient);

  private baseUrl = `${environment.baseUrl}${InfluencerEndpoints.base}${InfluencerEndpoints.profile.base}`;

  profile = signal<InfluencerProfile | null>(null);

  createInfluencerProfile(userId: string, data: CreateInfluencerProfile) {
    return this.http
      .post<{ message: string; profile: InfluencerProfile }>(`${this.baseUrl}/${userId}`, data)
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

  getInfluencerProfileByUserId(userId: string) {
    return this.http
      .get<{ message: string; profile: InfluencerProfile }>(`${this.baseUrl}/user/${userId}`)
      .pipe(tap(({ profile }) => this.profile.set(profile)));
  }

  updateInfluencerProfile(profileId: string, data: UpdateInfluencerProfile) {
    return this.http
      .patch<{ message: string; profile: InfluencerProfile }>(`${this.baseUrl}/${profileId}`, data)
      .pipe(tap(({ profile }) => this.profile.set(profile)));
  }
}
