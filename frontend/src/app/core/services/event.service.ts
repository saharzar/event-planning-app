import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Event, EventRequest, Page } from '../models/event-api.model';

export interface EventQueryParams {
  page?: number;
  size?: number;
  sort?: string;
}

@Injectable({ providedIn: 'root' })
export class EventService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/events`;

  getPublished(params: EventQueryParams = {}): Observable<Page<Event>> {
    return this.http.get<Page<Event>>(this.baseUrl, { params: this.toParams(params) });
  }

  search(title: string, params: EventQueryParams = {}): Observable<Page<Event>> {
    let httpParams = this.toParams(params);
    httpParams = httpParams.set('title', title);
    return this.http.get<Page<Event>>(`${this.baseUrl}/search`, { params: httpParams });
  }

  getById(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.baseUrl}/${id}`);
  }

  getMyEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.baseUrl}/my`);
  }

  create(request: EventRequest): Observable<Event> {
    return this.http.post<Event>(this.baseUrl, request);
  }

  update(id: number, request: EventRequest): Observable<Event> {
    return this.http.put<Event>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  publish(id: number): Observable<Event> {
    return this.http.patch<Event>(`${this.baseUrl}/${id}/publish`, null);
  }

  pause(id: number): Observable<Event> {
    return this.http.patch<Event>(`${this.baseUrl}/${id}/pause`, null);
  }

  archive(id: number): Observable<Event> {
    return this.http.patch<Event>(`${this.baseUrl}/${id}/archive`, null);
  }

  private toParams(params: EventQueryParams): HttpParams {
    let httpParams = new HttpParams();
    if (params.page !== undefined) httpParams = httpParams.set('page', params.page);
    if (params.size !== undefined) httpParams = httpParams.set('size', params.size);
    if (params.sort) httpParams = httpParams.set('sort', params.sort);
    return httpParams;
  }
}
