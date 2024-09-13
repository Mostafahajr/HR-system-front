import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd , RouterOutlet  } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButton, MatButtonModule } from '@angular/material/button';

import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatListModule,
    CommonModule ,
    MatButtonModule,
    RouterOutlet,
    MatIcon,
    MatButton,
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent implements OnInit {
  showSidenav = true;
  constructor(private router: Router) {}
  ngOnInit() {
    // Subscribe to router events to check the current URL
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Update the showSidenav variable based on the current URL
      this.showSidenav = this.router.url !== '/login';
    });
  }
  navigate(route: string): void {
    this.router.navigate([route]);
  }
}




