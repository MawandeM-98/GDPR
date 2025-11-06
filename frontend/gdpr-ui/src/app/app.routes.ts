import { Routes } from '@angular/router';
import { DashboardPageComponent } from './pages/dashboard/dashboard';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardPageComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];
