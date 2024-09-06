import { Component } from '@angular/core';
import { BreadcrumbsComponent } from '../../components/breadcrumbs/breadcrumbs.component';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-groups-and-permissions',
  standalone: true,
  imports: [BreadcrumbsComponent, MatButton],
  templateUrl: './groups-and-permissions.component.html',
  styleUrl: './groups-and-permissions.component.scss',
})
export class GroupsAndPermissionsComponent {
  constructor(private router: Router) {}

  navigate(route: string): void {
    this.router.navigate([route]);
  }
}
