import { Component } from '@angular/core';
import { BreadcrumbsComponent } from '../../components/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-general-rules-settings',
  standalone: true,
  imports: [BreadcrumbsComponent],
  templateUrl: './general-rules-settings.component.html',
  styleUrl: './general-rules-settings.component.scss',
})
export class GeneralRulesSettingsComponent {}
