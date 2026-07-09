import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { InstagramEndpoints } from '../models/constants';

@Injectable({
  providedIn: 'root',
})
export class SocialMedia {
  private http = inject(HttpClient);

  private baseUrl = `${environment.baseUrl}${InstagramEndpoints.base}`;

  private readonly REDIRECT_URI =
    'https://commute-helium-trustful.ngrok-free.dev/influencer/profile';
  // 'https://commute-helium-trustful.ngrok-free.dev/instagram/callback';

  private readonly SCOPES = [
    'instagram_business_basic',
    'instagram_business_content_publish',
    'instagram_business_manage_messages',
    'instagram_business_manage_comments',
    'instagram_business_manage_insights',
  ].join(',');

  getInstagramAccessToken() {
    const state = crypto.randomUUID();
    sessionStorage.setItem('ig_oauth_state', state);

    const url =
      `https://www.instagram.com/oauth/authorize` +
      `?client_id=${environment.instagramAppId}` +
      `&redirect_uri=${encodeURIComponent(this.REDIRECT_URI)}` +
      `&scope=${this.SCOPES}` +
      `&response_type=code` +
      `&state=${state}`;

    sessionStorage.setItem('url', url);
    window.location.href = url;
  }

  exchangeCode(code: string) {
    return this.http.post<{
      profile: {
        id: string;
        username: string;
        followers: number;
        mediaCount: number;
      };
      token: string;
    }>(`${this.baseUrl}${InstagramEndpoints.exchange}`, { code });
  }
}
