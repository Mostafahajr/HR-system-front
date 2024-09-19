import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-internal-server',
  standalone: true,
  imports: [RouterLink, MatButton],
  templateUrl: './internal-server.component.html',
  styleUrl: './internal-server.component.scss',
})
export class InternalServerComponent {
  constructor(private location: Location, private router: Router) {}

  goBack(): void {
    if (window.history.length > 1) {
      this.location.back(); // Only go back if there's a history
    } else {
      this.router.navigate(['/']); // Fallback to the home page or another route
    }
  }
}
