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

  constructor(private router: Router) {}

  ngOnInit() {
    // Check the current URL on component initialization
    this.checkSidenavVisibility();

    // Subscribe to router events to update sidenav visibility on route change
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkSidenavVisibility();
      });
  }

  checkSidenavVisibility() {
    // Set showSidenav based on whether the current route is '/login'
    this.showSidenav = this.router.url !== '/login';
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }
}
