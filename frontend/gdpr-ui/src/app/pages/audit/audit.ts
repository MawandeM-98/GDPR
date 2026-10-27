import { Component } from '@angular/core';

interface AuditEntry {
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  outcome: 'Success' | 'Failed';
}

@Component({
  selector: 'app-audit-page',
  standalone: true,
  templateUrl: './audit.html',
})
export class AuditPageComponent {
  entries: AuditEntry[] = [
    { timestamp: '2026-10-27 09:12', user: 'Admin', action: 'Exported data', resource: 'Access request #142', outcome: 'Success' },
    { timestamp: '2026-10-27 08:47', user: 'Admin', action: 'Deleted record', resource: 'Erasure request #139', outcome: 'Success' },
    { timestamp: '2026-10-26 16:30', user: 'j.smith', action: 'Updated consent', resource: 'Marketing preferences', outcome: 'Success' },
    { timestamp: '2026-10-26 14:05', user: 'j.smith', action: 'Login attempt', resource: 'Admin portal', outcome: 'Failed' },
    { timestamp: '2026-10-25 11:20', user: 'Admin', action: 'Reviewed vendor', resource: 'Hotjar', outcome: 'Success' },
  ];

  badgeClass(outcome: AuditEntry['outcome']): string {
    return outcome === 'Success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
  }
}