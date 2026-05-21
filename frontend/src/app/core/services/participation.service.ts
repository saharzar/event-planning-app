import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Participation } from '../models/participation.model';

@Injectable({ providedIn: 'root' })
export class ParticipationService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/participation`;

  join(eventId: number): Observable<Participation> {
    return this.http.post<Participation>(`${this.baseUrl}/${eventId}/join`, null);
  }

  getParticipants(eventId: number): Observable<Participation[]> {
    return this.http.get<Participation[]>(`${this.baseUrl}/${eventId}/participants`);
  }

  getMyUpcomingJoined(): Observable<Participation[]> {
    return this.http.get<Participation[]>(`${this.baseUrl}/my/upcoming`);
  }

  getMyPastOrArchivedJoined(): Observable<Participation[]> {
    return this.http.get<Participation[]>(`${this.baseUrl}/my/archived`);
  }

  hasJoined(eventId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/${eventId}/joined`);
  }

  getAttendeeCount(eventId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/${eventId}/count`);
  }

  leave(eventId: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/${eventId}/leave`, { responseType: 'text' });
  }
}
