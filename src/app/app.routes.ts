import { Routes } from '@angular/router';
import { DashboardPageComponent } from './features/dashboard/pages/dashboard-page.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardPageComponent },
  { path: '**', redirectTo: '/dashboard' },
];