import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { BreadcrumbsComponent } from '../../components/breadcrumbs/breadcrumbs.component';
@Component({
  selector: 'app-attendance-reports',
  standalone: true,
  imports: [BreadcrumbsComponent, MatExpansionModule],
  templateUrl: './attendance-reports.component.html',
  styleUrl: './attendance-reports.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttendanceReportsComponent {
  readonly panelOpenState = signal(false);
}
