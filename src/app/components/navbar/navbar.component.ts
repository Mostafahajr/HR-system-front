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
  showLogoutButton = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUserInfo(); // Initial check when component loads

    // Subscribe to router events to check if the user navigates after login
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Check if the user navigates to a logged-in page (e.g., '/dashboard')
        if (this.router.url !== '/login' && !!localStorage.getItem('token')) {
          this.showLogoutButton = true;
          this.loadUserInfo(); // Manually trigger user info fetch after navigation
        } else {
          this.showLogoutButton = false;
        }
      });
  }

  loadUserInfo(): void {
    const token = localStorage.getItem('token');

    if (token) {
      // Fetch the user info from AuthService
      this.authService.getUserInfo().subscribe({
        next: (userInfo) => {
          this.user = userInfo; // Set the user info after login
          console.log(this.user.user.name);

          console.log('User info loaded:', this.user);
        },
        error: (err) => {
          console.error('Error fetching user info:', err);
          this.user = null; // Set user to null if an error occurs
        },
      });
    } else {
      this.user = null; // No token, so no user info
    }
  }

  logout(): void {
    localStorage.removeItem('token'); // Remove the token
    this.router.navigate(['/login']); // Navigate to the login page
  }
}
