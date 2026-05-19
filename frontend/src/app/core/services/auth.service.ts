import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, RegisterRequest, User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  readonly currentUser = signal<User | null>(null);
  readonly loading = signal(false);

  loadCurrentUser(): Observable<User | null> {
    this.loading.set(true);
    return this.http.get<User>(`${this.baseUrl}/me`).pipe(
      tap((user) => this.currentUser.set(user)),
      catchError(() => {
        this.currentUser.set(null);
        return of(null);
      }),
      tap(() => this.loading.set(false))
    );
  }

  login(request: LoginRequest): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/login`, request).pipe(
      tap((user) => this.currentUser.set(user))
    );
  }

  register(request: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/register`, request).pipe(
      tap((user) => this.currentUser.set(user))
    );
  }

  logout(): Observable<void> {
    return this.http.post(`${this.baseUrl}/logout`, {}, { responseType: 'text' }).pipe(
      tap(() => this.currentUser.set(null)),
      map(() => undefined)
    );
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }
}
