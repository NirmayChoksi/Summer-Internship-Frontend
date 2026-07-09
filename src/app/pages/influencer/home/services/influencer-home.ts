import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { InfluencerEndpoints } from '../../models/constants';
import { InfluencerHome } from '../models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class InfluencerHomeService {
  private http = inject(HttpClient);

  private baseUrl = `${environment.baseUrl}${InfluencerEndpoints.base}${InfluencerEndpoints.home.base}`;

  getHome() {
    return this.http.get<{ message: string; data: InfluencerHome }>(`${this.baseUrl}`);
  }
}
