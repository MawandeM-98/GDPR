import { Routes } from '@angular/router';
import { DashboardPageComponent } from './pages/dashboard/dashboard';
import { RequestsPageComponent } from './pages/requests/requests';
import { VendorsPageComponent } from './pages/vendors/vendors';
import { AuditPageComponent } from './pages/audit/audit';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardPageComponent },
  { path: 'requests', component: RequestsPageComponent },
  { path: 'consent', component: DashboardPageComponent },
  { path: 'vendors', component: VendorsPageComponent },
  { path: 'audit', component: AuditPageComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' },
];