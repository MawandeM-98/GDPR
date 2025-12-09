import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  host: { 
    'ngSkipHydration': 'true',
    'class': 'hydrate-skip' 
  }
})
export class DashboardPageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('requestTypesCanvas') requestTypesCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('consentCanvas') consentCanvas!: ElementRef<HTMLCanvasElement>;
  
  private requestTypesChart: Chart | null = null;
  private consentChart: Chart | null = null;
  
  activePage: 'dashboard' | 'requests' | 'consent' | 'vendors' | 'audit' = 'dashboard';
  private isBrowser: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    
    // Initial render with a small delay
    setTimeout(() => {
      this.renderChartsForCurrentPage();
    }, 100);
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;
    this.destroyCharts();
  }

  navigateToPage(page: 'dashboard' | 'requests' | 'consent' | 'vendors' | 'audit'): void {
    if (!this.isBrowser) return;
    
    // Destroy existing charts
    this.destroyCharts();
    
    // Change page
    this.activePage = page;
    
    // Render charts for new page with delay
    setTimeout(() => {
      this.renderChartsForCurrentPage();
    }, 150);
  }

  private destroyCharts(): void {
    if (this.requestTypesChart) {
      this.requestTypesChart.destroy();
      this.requestTypesChart = null;
      console.log('Request Types Chart destroyed');
    }
    if (this.consentChart) {
      this.consentChart.destroy();
      this.consentChart = null;
      console.log('Consent Chart destroyed');
    }
  }

  private renderChartsForCurrentPage(): void {
    if (!this.isBrowser) return;
    
    console.log('Rendering charts for page:', this.activePage);
    
    // Small delay to ensure DOM is updated
    setTimeout(() => {
      if (this.activePage === 'dashboard' || this.activePage === 'requests') {
        this.createRequestTypesChart();
      }
      
      if (this.activePage === 'dashboard' || this.activePage === 'consent') {
        this.createConsentChart();
      }
    }, 50);
  }

  private createRequestTypesChart(): void {
    if (!this.isBrowser) return;
    
    // Try multiple ways to get the canvas
    let canvas: HTMLCanvasElement | null = null;
    
    // Try ViewChild
    if (this.requestTypesCanvas?.nativeElement) {
      canvas = this.requestTypesCanvas.nativeElement;
    }
    
    // Try by ID
    if (!canvas) {
      canvas = document.getElementById('requestTypesCanvas') as HTMLCanvasElement;
    }
    
    if (!canvas) {
      console.warn('Request Types canvas not found in DOM');
      return;
    }
    
    // Clear any existing chart
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
          }
        }
      }
    };

    try {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        this.requestTypesChart = new Chart(ctx, doughnutConfig);
        console.log('✅ Request Types Chart created successfully');
      }
    } catch (error) {
      console.error('Error creating request types chart:', error);
    }
  }

  private createConsentChart(): void {
    if (!this.isBrowser) return;
    
    // Try multiple ways to get the canvas
    let canvas: HTMLCanvasElement | null = null;
    
    // Try ViewChild
    if (this.consentCanvas?.nativeElement) {
      canvas = this.consentCanvas.nativeElement;
    }
    
    // Try by ID
    if (!canvas) {
      canvas = document.getElementById('consentCanvas') as HTMLCanvasElement;
    }
    
    if (!canvas) {
      console.warn('Consent canvas not found in DOM');
      return;
    }
    
    // Clear any existing chart
    if (this.consentChart) {
      this.consentChart.destroy();
    }

    const barConfig: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels: ['Marketing', 'Cookies', 'Analytics', 'Third-party'],
        datasets: [{
          label: 'Consented',
          data: [2200, 1100, 550, 300],
          backgroundColor: '#10b981',
          borderWidth: 0,
          borderRadius: 4,
          barPercentage: 0.6,
          categoryPercentage: 0.7
        }]
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
              callback: function(value: number | string): string {
                if (typeof value === 'number') {
                  return value.toLocaleString();
                }
                return value.toString();
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
      const ctx = canvas.getContext('2d');
      if (ctx) {
        this.consentChart = new Chart(ctx, barConfig);
        console.log('✅ Consent Chart created successfully');
      }
    } catch (error) {
      console.error('Error creating consent chart:', error);
    }
  }
}