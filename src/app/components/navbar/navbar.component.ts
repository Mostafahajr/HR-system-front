import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  user: any = null;
  showLogoutButton = false; // To control the visibility of the Logout button

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUserInfo();

    // Subscribe to router events to update the showLogoutButton flag based on the current route
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.showLogoutButton =
          this.router.url !== '/login' && !!localStorage.getItem('token');
      });
  }

  loadUserInfo(): void {
    const token = localStorage.getItem('token');

    if (token) {
      console.log(1);
      this.authService.getUserInfo().subscribe({
        next: (userInfo) => {
          console.log(2);
          this.user = userInfo; // Set the user info
          console.log(3);
          console.log('User info loaded:', this.user); // Debug log
        },
        error: (err) => {
          console.error('Error fetching user info:', err); // Handle errors
          this.user = null; // Set user to null if an error occurs
        },
      });
    } else {
      this.user = null; // No token, so no user info
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
