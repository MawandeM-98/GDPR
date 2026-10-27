import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar';
import { TopbarComponent } from './components/topbar/topbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent],
  template: `
    <div class="flex min-h-screen bg-slate-50">
      <app-sidebar />
      <div class="flex-1 flex flex-col min-w-0">
        <app-topbar />
        <main class="p-6">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class AppComponent {}