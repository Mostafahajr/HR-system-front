import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-internal-server',
  standalone: true,
  imports: [RouterLink,MatButton],
  templateUrl: './internal-server.component.html',
  styleUrl: './internal-server.component.scss'
})
export class InternalServerComponent {
  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();  // This will take the user to the previous page
  }
}
