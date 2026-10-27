import { Routes } from '@angular/router';
import { DashboardPageComponent } from './pages/dashboard/dashboard';
import { VendorsPageComponent } from './pages/vendors/vendors';
import { AuditPageComponent } from './pages/audit/audit';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardPageComponent },
  { path: 'requests', component: DashboardPageComponent, data: { page: 'requests' } },
  { path: 'consent', component: DashboardPageComponent, data: { page: 'consent' } },
  { path: 'vendors', component: VendorsPageComponent },
  { path: 'audit', component: AuditPageComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' },
];