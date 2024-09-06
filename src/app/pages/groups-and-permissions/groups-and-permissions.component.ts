import { Component } from '@angular/core';
import { BreadcrumbsComponent } from '../../components/breadcrumbs/breadcrumbs.component';
import { Router, RouterOutlet } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-groups-and-permissions',
  standalone: true,
  imports: [BreadcrumbsComponent, MatButton, RouterOutlet,NgIf],
  templateUrl: './groups-and-permissions.component.html',
  styleUrl: './groups-and-permissions.component.scss',
})
export class GroupsAndPermissionsComponent {
  constructor(private router: Router) {}

  navigate(route: string): void {
    this.router.navigate([route]);
  }
  isAddNewGroupRoute(): boolean {
    return this.router.url === '/groups-and-permissions';
  }
}
