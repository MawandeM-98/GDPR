import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../config/api';

export type RequestType = 'access' | 'correction' | 'erasure';
export type RequestStatus = 'pending' | 'in_progress' | 'resolved';

export interface GdprRequest {
  _id: string;
  type: RequestType;
  status: RequestStatus;
  requesterName: string;
  requesterEmail: string;
  details: string;
  dueDate: string;
  resolvedAt?: string;
  createdAt: string;
}

export interface NewRequest {
  type: RequestType;
  requesterName: string;
  requesterEmail: string;
  details?: string;
}

@Injectable({ providedIn: 'root' })
export class RequestsService {
  private http = inject(HttpClient);

  getRequests(status?: string, type?: string): Observable<GdprRequest[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    if (type) params = params.set('type', type);
    return this.http.get<GdprRequest[]>(`${API_URL}/requests`, { params });
  }

  createRequest(body: NewRequest): Observable<GdprRequest> {
    return this.http.post<GdprRequest>(`${API_URL}/requests`, body);
  }

  updateStatus(id: string, status: RequestStatus): Observable<GdprRequest> {
    return this.http.patch<GdprRequest>(`${API_URL}/requests/${id}`, { status });
  }
}