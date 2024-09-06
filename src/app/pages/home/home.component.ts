import { Component } from '@angular/core';
import { BreadcrumbsComponent } from '../../components/breadcrumbs/breadcrumbs.component';
import { AddNewGroupComponent } from '../add-new-group/add-new-group.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BreadcrumbsComponent, AddNewGroupComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  title: string = 'Home';
}
