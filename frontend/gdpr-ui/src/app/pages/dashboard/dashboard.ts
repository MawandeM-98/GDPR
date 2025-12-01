import { Component, AfterViewInit, OnDestroy, Inject, PLATFORM_ID, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import Chart, { ChartConfiguration } from 'chart.js/auto';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardPageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('requestTypesCanvas') requestTypesCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('consentCanvas') consentCanvas!: ElementRef<HTMLCanvasElement>;
  
  private requestTypesChart: Chart | null = null;
  private consentChart: Chart | null = null;
  
  activePage: 'dashboard' | 'requests' | 'consent' | 'vendors' | 'audit' = 'dashboard';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Initial render of charts on dashboard
      setTimeout(() => {
        this.initializeCharts();
      }, 0); // Ensure DOM is ready
    }
  }

  ngOnDestroy(): void {
    this.destroyCharts();
  }

  // Navigation handler
  navigateToPage(page: 'dashboard' | 'requests' | 'consent' | 'vendors' | 'audit'): void {
    this.activePage = page;
    this.cdr.detectChanges(); // Force change detection
    
    // Reinitialize charts when switching to relevant pages
    setTimeout(() => {
      this.destroyCharts();
      if (page === 'dashboard' || page === 'requests' || page === 'consent') {
        this.initializeCharts();
      }
    }, 50); // Small delay to ensure DOM is updated
  }

  private destroyCharts(): void {
    if (this.requestTypesChart) {
      this.requestTypesChart.destroy();
      this.requestTypesChart = null;
    }
    if (this.consentChart) {
      this.consentChart.destroy();
      this.consentChart = null;
    }
  }

  private initializeCharts(): void {
    // Only initialize charts if they should be visible on current page
    if (this.shouldShowRequestChart()) {
      this.initializeRequestTypesChart();
    }
    
    if (this.shouldShowConsentChart()) {
      this.initializeConsentChart();
    }
  }

  private shouldShowRequestChart(): boolean {
    return this.activePage === 'dashboard' || this.activePage === 'requests';
  }

  private shouldShowConsentChart(): boolean {
    return this.activePage === 'dashboard' || this.activePage === 'consent';
  }

  private initializeRequestTypesChart(): void {
    if (!this.requestTypesCanvas?.nativeElement) {
      console.warn('Request types canvas not available');
      return;
    }

    // Destroy existing chart
    if (this.requestTypesChart) {
      this.requestTypesChart.destroy();
    }

    const doughnutConfig: ChartConfiguration<'doughnut'> = {
      type: 'doughnut',
      data: {
        labels: ['Access Requests', 'Correction Requests', 'Erasure Requests'],
        datasets: [{
          label: 'Request Types',
          data: [85, 32, 25],
          backgroundColor: [
            'rgb(59, 130, 246)',
            'rgb(245, 158, 11)',
            'rgb(239, 68, 68)'
          ],
          borderWidth: 0,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 15,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.raw as number;
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    };

    try {
      this.requestTypesChart = new Chart(this.requestTypesCanvas.nativeElement, doughnutConfig);
    } catch (error) {
      console.error('Error creating request types chart:', error);
    }
  }

  private initializeConsentChart(): void {
    if (!this.consentCanvas?.nativeElement) {
      console.warn('Consent canvas not available');
      return;
    }

    // Destroy existing chart
    if (this.consentChart) {
      this.consentChart.destroy();
    }

    const barConfig: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels: ['Marketing', 'Cookies', 'Analytics', 'Third-party'],
        datasets: [
          {
            label: 'Consented',
            data: [2200, 1100, 550, 300],
            backgroundColor: '#10b981',
            borderWidth: 0,
            borderRadius: 4,
            barPercentage: 0.6,
            categoryPercentage: 0.7
          },
          {
            label: 'Withdrawn',
            data: [450, 200, 180, 150],
            backgroundColor: '#ef4444',
            borderWidth: 0,
            borderRadius: 4,
            barPercentage: 0.6,
            categoryPercentage: 0.7
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              callback: function(value) {
                return value.toLocaleString();
              }
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              pointStyle: 'rectRounded',
              padding: 15
            }
          }
        }
      }
    };

    try {
      this.consentChart = new Chart(this.consentCanvas.nativeElement, barConfig);
    } catch (error) {
      console.error('Error creating consent chart:', error);
    }
  }

  // Helper method to update chart data (if needed in future)
  updateRequestTypesData(newData: number[]): void {
    if (this.requestTypesChart) {
      this.requestTypesChart.data.datasets[0].data = newData;
      this.requestTypesChart.update();
    }
  }

  updateConsentData(consentedData: number[], withdrawnData: number[]): void {
    if (this.consentChart) {
      this.consentChart.data.datasets[0].data = consentedData;
      this.consentChart.data.datasets[1].data = withdrawnData;
      this.consentChart.update();
    }
  }
}