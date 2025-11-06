import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar';
import { TopbarComponent } from './components/topbar/topbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, SidebarComponent, TopbarComponent], // Import standalone components
  template: `
    <app-topbar></app-topbar>
    <app-sidebar></app-sidebar>
    <router-outlet></router-outlet>`,
  styles: [],
})
export class AppComponent {}