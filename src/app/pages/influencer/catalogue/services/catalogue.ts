import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { InfluencerEndpoints } from '../../models/constants';
import { Catalogue, InstagramMedia } from '../model/interfaces';

@Injectable({
  providedIn: 'root',
})
export class CatalogueService {
  private http = inject(HttpClient);

  private baseUrl = `${environment.baseUrl}${InfluencerEndpoints.base}${InfluencerEndpoints.catalogue.base}`;

  uploadCatalogues(formData: FormData) {
    return this.http.post<{ message: string; catalogues: Catalogue[] }>(
      `${this.baseUrl}`,
      formData,
    );
  }

  getMyCatalogues() {
    return this.http.get<{ message: string; catalogues: Catalogue[] }>(`${this.baseUrl}`);
  }

  getInstagramMedia() {
    return this.http.get<{
      media: InstagramMedia[];
      pagination: {
        nextCursor: string;
        hasNextPage: boolean;
      };
    }>(`${this.baseUrl}${InfluencerEndpoints.catalogue.instagramMedia}`);
  }

  deleteCatalogue(catalogueId: string) {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${catalogueId}`);
  }

  deleteManyCatalogues(catalogueIds: string[]) {
    return this.http.request<{ message: string }>(
      'DELETE',
      `${this.baseUrl}${InfluencerEndpoints.catalogue.bulk}`,
      {
        body: {
          catalogueIds,
        },
      },
    );
  }
}
