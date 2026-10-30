import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { DashboardService, DashboardStats } from '../../services/dashboard.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  @ViewChild('requestTypesCanvas') requestTypesCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('consentCanvas') consentCanvas!: ElementRef<HTMLCanvasElement>;

  private dashboardService = inject(DashboardService);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private requestTypesChart: Chart | null = null;
  private consentChart: Chart | null = null;

  stats: DashboardStats | null = null;
  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    if (!this.isBrowser) return;
    this.loadStats();
  }

  ngOnDestroy(): void {
    this.destroyCharts();
  }

  loadStats(): void {
    this.loading = true;
    this.errorMessage = '';

    this.dashboardService.getStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.loading = false;
        this.renderCharts(stats);
      },
      error: () => {
        this.loading = false;
        this.errorMessage =
          "Couldn't load dashboard data. Check that the API is running on http://localhost:3000.";
      },
    });
  }

  private destroyCharts(): void {
    this.requestTypesChart?.destroy();
    this.requestTypesChart = null;
    this.consentChart?.destroy();
    this.consentChart = null;
  }

  private renderCharts(stats: DashboardStats): void {
    this.destroyCharts();

    const typesCtx = this.requestTypesCanvas?.nativeElement.getContext('2d');
    if (typesCtx) {
      this.requestTypesChart = new Chart(typesCtx, {
        type: 'doughnut',
        data: {
          labels: ['Access Requests', 'Correction Requests', 'Erasure Requests'],
          datasets: [
            {
              label: 'Request Types',
              data: [
                stats.requestTypes.access,
                stats.requestTypes.correction,
                stats.requestTypes.erasure,
              ],
              backgroundColor: ['rgb(59, 130, 246)', 'rgb(245, 158, 11)', 'rgb(239, 68, 68)'],
              borderWidth: 0,
              hoverOffset: 8,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '65%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: { padding: 15, usePointStyle: true, pointStyle: 'circle' },
            },
          },
        },
      });
    }

    const consentCtx = this.consentCanvas?.nativeElement.getContext('2d');
    if (consentCtx) {
      this.consentChart = new Chart(consentCtx, {
        type: 'bar',
        data: {
          labels: ['Marketing', 'Cookies', 'Analytics', 'Third-party'],
          datasets: [
            {
              label: 'Consented',
              data: [
                stats.consent.marketing,
                stats.consent.cookies,
                stats.consent.analytics,
                stats.consent.third_party,
              ],
              backgroundColor: '#10b981',
              borderWidth: 0,
              borderRadius: 4,
              barPercentage: 0.6,
              categoryPercentage: 0.7,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { grid: { display: false } },
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(0, 0, 0, 0.05)' },
              ticks: { callback: (value) => Number(value).toLocaleString() },
            },
          },
          plugins: {
            legend: {
              position: 'top',
              labels: { usePointStyle: true, pointStyle: 'rectRounded', padding: 15 },
            },
          },
        },
      });
    }
  }
}