import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import { DashboardCardsComponent } from '../../components/dashboard-cards/dashboard-cards';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, DashboardCardsComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardPageComponent implements AfterViewInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      /** ✅ Doughnut chart for Request Types **/
      const ctx1 = document.getElementById('requestTypesChart') as HTMLCanvasElement | null;
      if (ctx1) {
        const doughnutConfig: ChartConfiguration<'doughnut'> = {
          type: 'doughnut',
          data: {
            labels: ['Access Requests', 'Correction Requests', 'Erasure Requests'],
            datasets: [
              {
                data: [70, 20, 52],
                backgroundColor: ['#3b82f6', '#f59e0b', '#ef4444']
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%' // ✅ correct placement: belongs in options, not dataset
          }
        };
        new Chart(ctx1, doughnutConfig);
      }

      /** ✅ Bar chart for Consent Stats **/
      const ctx2 = document.getElementById('consentStatsChart') as HTMLCanvasElement | null;
      if (ctx2) {
        const barConfig: ChartConfiguration<'bar'> = {
          type: 'bar',
          data: {
            labels: ['Marketing', 'Cookies', 'Analytics', 'Third-party'],
            datasets: [
              {
                label: 'Consented',
                data: [1100, 2200, 2000, 900],
                backgroundColor: '#3b82f6'
              },
              {
                label: 'Withdrawn',
                data: [150, 200, 180, 350],
                backgroundColor: '#ef4444'
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true } }
          }
        };
        new Chart(ctx2, barConfig);
      }
    }
  }
}
