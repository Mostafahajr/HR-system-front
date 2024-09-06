import { Component } from '@angular/core';
import { BreadcrumbsComponent } from '../../components/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-official-holidays',
  standalone: true,
  imports: [BreadcrumbsComponent],
  templateUrl: './official-holidays.component.html',
  styleUrl: './official-holidays.component.scss',
})
export class OfficialHolidaysComponent {}
