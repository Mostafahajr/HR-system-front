import { MatIcon } from '@angular/material/icon';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreadcrumbService } from '../../services/breadcrumbs.service';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIcon,MatButton],
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
})
export class BreadcrumbsComponent implements OnInit, OnDestroy {
  breadcrumbs: Array<{ label: string; url: string }> = [];
  private routerEventsSubscription: any;

  constructor(
    private breadcrumbService: BreadcrumbService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to router events to update breadcrumbs on route change
    this.routerEventsSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateBreadcrumbs();
      });

    // Initial update
    this.updateBreadcrumbs();
  }

  ngOnDestroy(): void {
    // Clean up the subscription
    if (this.routerEventsSubscription) {
      this.routerEventsSubscription.unsubscribe();
    }
  }

  updateBreadcrumbs(): void {
    // Update the breadcrumbs based on the current route
    this.breadcrumbs = this.breadcrumbService.breadcrumbs;
  }
  
  // for navigation of any button next to breadcrmb
  navigate(route: string): void {
    this.router.navigate([route]);
  }
}
