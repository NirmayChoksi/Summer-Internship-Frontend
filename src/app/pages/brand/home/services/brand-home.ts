import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BrandEndpoints } from '../../models/constants';
import { BrandHome } from '../models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class BrandHomeService {
  private http = inject(HttpClient);

  private baseUrl = `${environment.baseUrl}${BrandEndpoints.base}${BrandEndpoints.home.base}`;

  getHome() {
    return this.http.get<{ message: string; data: BrandHome }>(`${this.baseUrl}`);
  }
}
