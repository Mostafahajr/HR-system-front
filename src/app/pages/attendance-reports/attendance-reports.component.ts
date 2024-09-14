import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { BreadcrumbsComponent } from '../../components/breadcrumbs/breadcrumbs.component';
import { Router, RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-attendance-reports',
  standalone: true,
  imports: [BreadcrumbsComponent, MatExpansionModule,RouterOutlet],
  templateUrl: './attendance-reports.component.html',
  styleUrl: './attendance-reports.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttendanceReportsComponent {
  readonly panelOpenState = signal(false);
  constructor(private router: Router){

  }
  navigate(route: string): void {
    this.router.navigate([route]);
  }
  isAddNewAttendancesRoute(): boolean {
    return this.router.url === '/attendance-reports';
  }
}
