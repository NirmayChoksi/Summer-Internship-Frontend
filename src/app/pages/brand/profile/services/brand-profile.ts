import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { Auth } from 'src/app/pages/auth/services/auth';
import { environment } from 'src/environments/environment';
import { BrandEndpoints } from '../../models/constants';
import { BrandProfile, CreateBrandProfile, UpdateBrandProfile } from '../models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class BrandProfileService {
  private http = inject(HttpClient);
  private authService = inject(Auth);

  private baseUrl = `${environment.baseUrl}${BrandEndpoints.base}${BrandEndpoints.profile.base}`;

  profile = signal<BrandProfile | null>(null);

  createBrandProfile(data: CreateBrandProfile) {
    return this.http.post<{ message: string; profile: BrandProfile }>(`${this.baseUrl}`, data).pipe(
      tap(({ profile }) => {
        this.profile.set(profile);

        this.authService.updateUser({ isProfileComplete: true });
      }),
    );
  }

  getBrandProfileById(profileId: string) {
    return this.http
      .get<{ message: string; profile: BrandProfile }>(`${this.baseUrl}/${profileId}`)
      .pipe(tap(({ profile }) => this.profile.set(profile)));
  }

  getBrandProfileByUserId() {
    return this.http
      .get<{ message: string; profile: BrandProfile }>(`${this.baseUrl}/user`)
      .pipe(tap(({ profile }) => this.profile.set(profile)));
  }

  updateBrandProfile(profileId: string, data: UpdateBrandProfile) {
    return this.http
      .patch<{ message: string; profile: BrandProfile }>(`${this.baseUrl}/${profileId}`, data)
      .pipe(tap(({ profile }) => this.profile.set(profile)));
  }
}
