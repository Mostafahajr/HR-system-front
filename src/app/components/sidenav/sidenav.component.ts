import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatListModule,
    CommonModule,
    MatButtonModule,
    RouterOutlet,
    MatIconModule,
  ],
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
  showSidenav = true;
  activeRoute: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkSidenavVisibility();

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.activeRoute = this.router.url; // Always get the current route from the router
        this.checkSidenavVisibility();
      });
  }

  checkSidenavVisibility() {
    const hiddenRoutes = [
      '/login',
      '/not-found',
      '/unauthorized',
      '/internal-server',
    ];
    this.showSidenav = !hiddenRoutes.some((route) =>
      this.router.url.includes(route)
    );
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }

  isActive(route: string): boolean {
    if (route === '' || route === '/') {
      return this.activeRoute === '' || this.activeRoute === '/'; // Treat '' and '/' as equivalent
    }
    return this.activeRoute === route;
  }
}
