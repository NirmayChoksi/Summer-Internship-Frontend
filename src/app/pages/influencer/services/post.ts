import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { InfluencerEndpoints } from '../models/constants';
import { CaptionResult, PublishMedia, RefineCaptionRequest } from '../models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class Post {
  private http = inject(HttpClient);

  private baseUrl = `${environment.baseUrl}${InfluencerEndpoints.base}${InfluencerEndpoints.post.base}`;

  generateCaption(file: File, userText: string | null) {
    const formData = new FormData();

    formData.append('post', file);

    if (userText) formData.append('userText', userText);

    return this.http.post<CaptionResult>(
      `${this.baseUrl}${InfluencerEndpoints.post.generateCaption}`,
      formData,
    );
  }

  refineCaption(payload: RefineCaptionRequest) {
    return this.http.post<{ caption: string }>(
      `${this.baseUrl}${InfluencerEndpoints.post.refineCaption}`,
      payload,
    );
  }

  publishMedia(payload: PublishMedia) {
    return this.http.post<{ message: string }>(
      `${this.baseUrl}${InfluencerEndpoints.post.publishMedia}`,
      payload,
    );
  }
}
