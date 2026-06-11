import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Catalogue } from '../model/interfaces';
import { InfluencerEndpoints } from '../../models/constants';

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
