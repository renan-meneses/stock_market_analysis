import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppHeaderComponent } from './core/layout/header/app-header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AppHeaderComponent],
  template: `
    <div class="app-shell">
      <app-header />
      <main class="app-main">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .app-shell { min-height: 100vh; background: var(--bg-primary, #f0f2f5); display: flex; flex-direction: column; }
    .app-main { flex: 1; }
  `]
})
export class AppComponent {}