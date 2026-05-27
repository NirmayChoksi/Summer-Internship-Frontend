import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UploadEndpoints } from '../models/constants';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Upload {
  private http = inject(HttpClient);

  private baseUrl = `${environment.baseUrl}${UploadEndpoints.base}`;

  uploadCompanyLogo(file: File) {
    const formData = new FormData();

    formData.append('companyLogo', file);

    return this.http.post<{ url: string }>(
      `${this.baseUrl}${UploadEndpoints.companyLogo}`,
      formData,
    );
  }
}
