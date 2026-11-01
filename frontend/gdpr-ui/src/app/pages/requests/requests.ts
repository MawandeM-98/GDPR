import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  GdprRequest,
  RequestStatus,
  RequestType,
  RequestsService,
} from '../../services/requests.service';

@Component({
  selector: 'app-requests-page',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './requests.html',
  styleUrl: './requests.css',
})
export class RequestsPageComponent implements OnInit {
  private service = inject(RequestsService);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  requests: GdprRequest[] = [];
  statusFilter = '';
  typeFilter = '';
  loading = false;
  errorMessage = '';

  showForm = false;
  saving = false;
  formError = '';
  newRequest: { type: RequestType; requesterName: string; requesterEmail: string; details: string } = {
    type: 'access',
    requesterName: '',
    requesterEmail: '',
    details: '',
  };

  ngOnInit(): void {
    if (!this.isBrowser) return;
    this.load();
  }

  load(): void {
    this.loading = true;
    this.errorMessage = '';

    this.service.getRequests(this.statusFilter, this.typeFilter).subscribe({
      next: (requests) => {
        this.requests = requests;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage =
          "Couldn't load requests. Check that the API is running on http://localhost:3000.";
      },
    });
  }

  onStatusFilter(value: string): void {
    this.statusFilter = value;
    this.load();
  }

  onTypeFilter(value: string): void {
    this.typeFilter = value;
    this.load();
  }

  setStatus(request: GdprRequest, status: RequestStatus): void {
    this.service.updateStatus(request._id, status).subscribe({
      next: () => this.load(),
      error: () => {
        this.errorMessage = "Couldn't update that request. Please try again.";
      },
    });
  }

  create(): void {
    this.formError = '';

    if (!this.newRequest.requesterName.trim() || !this.newRequest.requesterEmail.trim()) {
      this.formError = 'Name and email are required.';
      return;
    }

    this.saving = true;
    this.service.createRequest(this.newRequest).subscribe({
      next: () => {
        this.saving = false;
        this.showForm = false;
        this.newRequest = { type: 'access', requesterName: '', requesterEmail: '', details: '' };
        this.load();
      },
      error: (err) => {
        this.saving = false;
        this.formError = err?.error?.message ?? "Couldn't create the request.";
      },
    });
  }

  isOverdue(request: GdprRequest): boolean {
    return request.status !== 'resolved' && new Date(request.dueDate).getTime() < Date.now();
  }

  typeLabel(type: RequestType): string {
    return { access: 'Access', correction: 'Correction', erasure: 'Erasure' }[type];
  }

  statusLabel(status: RequestStatus): string {
    return { pending: 'Pending', in_progress: 'In progress', resolved: 'Resolved' }[status];
  }

  statusClass(status: RequestStatus): string {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-700';
      case 'in_progress':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  }
}