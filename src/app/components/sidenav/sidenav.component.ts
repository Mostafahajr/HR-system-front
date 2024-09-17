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
      .subscribe((event: any) => {
        this.activeRoute = event.urlAfterRedirects; // Capture the active route
        this.checkSidenavVisibility();
      });
  }
  checkSidenavVisibility() {
    const hiddenRoutes = ['/login', '/not-found', '/unauthorized', '/internal-server'];
    this.showSidenav = !hiddenRoutes.some(route => this.router.url.includes(route));
  }

  navigate(route: string): void {
    this.router.navigate([route]);
    this.activeRoute = route; // Update active route when navigating
  }

  isActive(route: string): boolean {
    return this.activeRoute === route;
  }
}
