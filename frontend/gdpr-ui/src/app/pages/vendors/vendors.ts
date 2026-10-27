import { Component } from '@angular/core';

interface Vendor {
  name: string;
  service: string;
  dataShared: string;
  dpaStatus: 'Signed' | 'Pending' | 'Expired';
  lastReview: string;
}

@Component({
  selector: 'app-vendors-page',
  standalone: true,
  templateUrl: './vendors.html',
})
export class VendorsPageComponent {
  vendors: Vendor[] = [
    { name: 'Google Analytics', service: 'Web analytics', dataShared: 'Usage data, IP address', dpaStatus: 'Signed', lastReview: '2026-08-14' },
    { name: 'Mailchimp', service: 'Email marketing', dataShared: 'Name, email', dpaStatus: 'Signed', lastReview: '2026-07-02' },
    { name: 'Stripe', service: 'Payments', dataShared: 'Name, billing details', dpaStatus: 'Signed', lastReview: '2026-09-21' },
    { name: 'Hotjar', service: 'Session recording', dataShared: 'Behavioural data', dpaStatus: 'Pending', lastReview: '2026-05-30' },
    { name: 'Zendesk', service: 'Customer support', dataShared: 'Name, email, tickets', dpaStatus: 'Expired', lastReview: '2025-11-11' },
  ];

  badgeClass(status: Vendor['dpaStatus']): string {
    switch (status) {
      case 'Signed': return 'bg-green-100 text-green-700';
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-red-100 text-red-700';
    }
  }
}