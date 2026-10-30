import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../config/api';

export interface DashboardStats {
  totalRequests: number;
  pendingRequests: number;
  resolvedRequests: number;
  overdueRequests: number;
  complianceScore: number;
  requestTypes: {
    access: number;
    correction: number;
    erasure: number;
  };
  consent: {
    marketing: number;
    cookies: number;
    analytics: number;
    third_party: number;
  };
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${API_URL}/dashboard/stats`);
  }
}