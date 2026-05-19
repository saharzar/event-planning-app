import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Attendance } from '../models/attendance.model';

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/attendance`;

  join(eventId: number): Observable<Attendance> {
    return this.http.post<Attendance>(`${this.baseUrl}/${eventId}/join`, null);
  }

  leave(eventId: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/${eventId}/leave`, { responseType: 'text' });
  }

  getParticipants(eventId: number): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${this.baseUrl}/${eventId}/participants`);
  }

  getMyJoined(): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${this.baseUrl}/my`);
  }

  hasJoined(eventId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/${eventId}/joined`);
  }

  getAttendeeCount(eventId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/${eventId}/count`);
  }
}
