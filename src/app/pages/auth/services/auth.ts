import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthEndpoints } from '../models/constants';
import {
  CreatePassword,
  Login,
  Register,
  RegisterResponse,
  User,
  VerifyOtp,
} from '../models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);

  private baseUrl = `${environment.baseUrl}${AuthEndpoints.base}`;

  private token = signal<string | null>(localStorage.getItem('token'));
  private userSignal = signal<User | null>(this.getStoredUser());

  isAuthenticated = computed(() => !!this.token());
  user = computed(() => this.userSignal());
  role = computed(() => this.user()?.role ?? null);
  isProfileComplete = computed(() => this.user()?.isProfileComplete ?? false);

  register(data: Register) {
    return this.http.post<RegisterResponse>(`${this.baseUrl}${AuthEndpoints.register}`, data);
  }

  verifyOtp(data: VerifyOtp) {
    return this.http.post<{ message: string }>(`${this.baseUrl}${AuthEndpoints.verifyOtp}`, data);
  }

  resendOtp(email: string) {
    return this.http.post<{ message: string }>(`${this.baseUrl}${AuthEndpoints.resendOtp}`, {
      email,
    });
  }

  createPassword(data: CreatePassword) {
    return this.http.post<{ message: string }>(
      `${this.baseUrl}${AuthEndpoints.createPassword}`,
      data,
    );
  }

  login(data: Login) {
    return this.http
      .post<{
        token: string;
        user: User;
      }>(`${this.baseUrl}/login`, data)
      .pipe(
        tap((res) => {
          this.setSession(res.token, res.user);
        }),
      );
  }

  logout() {
    localStorage.removeItem('token');

    localStorage.removeItem('user');

    this.token.set(null);

    this.userSignal.set(null);
  }

  getToken() {
    return this.token();
  }

  updateUser(partial: Partial<User>) {
    const currentUser = this.user();

    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      ...partial,
    };

    localStorage.setItem('user', JSON.stringify(updatedUser));

    this.userSignal.set(updatedUser);
  }

  private setSession(token: string, user: User) {
    localStorage.setItem('token', token);

    localStorage.setItem('user', JSON.stringify(user));

    this.token.set(token);

    this.userSignal.set(user);
  }

  private getStoredUser(): User | null {
    try {
      const user = localStorage.getItem('user');

      return user ? (JSON.parse(user) as User) : null;
    } catch {
      return null;
    }
  }
}
