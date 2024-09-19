import { HomeService } from './../../services/home/home.service';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BreadcrumbsComponent } from '../../components/breadcrumbs/breadcrumbs.component';
import { AddNewGroupComponent } from '../add-new-group/add-new-group.component';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { DataSource } from '@angular/cdk/collections';
import { MatTableModule } from '@angular/material/table';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BreadcrumbsComponent, AddNewGroupComponent,CommonModule,MatCardModule,MatTableModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  displayedColumns: string[] = [ 'name', 'department', 'salary'];
  title: string = 'Home';
  dataSource:any;
  static:any ={};

  constructor(private homeService:HomeService){
    this.getStatics();


    console.log(this.static);

  }
  getStatics(){
    const jsonData = this.homeService.getStatic().subscribe({
      next:(response)=>{
        console.log(response);

        this.static = response;
        this.dataSource=this.static.topSalaries
        this.static.upcomingHoliday = new Date(this.static.upcomingHoliday).toDateString();
      },
      error:(error)=>{
        console.log(error);
      }
    })



  }
}
