import { Component, OnInit } from '@angular/core';
import { BreadcrumbsComponent } from '../../components/breadcrumbs/breadcrumbs.component';
import { OfficialHolidaysService } from '../../services/official-holidays/official-holidays.service';
import { IHoliday } from '../../models/iHoliday';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor } from '@angular/common';


@Component({
  selector: 'app-official-holidays',
  standalone: true,
  imports: [BreadcrumbsComponent, FormsModule, NgFor,CommonModule],
  templateUrl: './official-holidays.component.html',
  styleUrls: ['./official-holidays.component.scss'],
})
export class OfficialHolidaysComponent {

  holidays: IHoliday[] = [];
  oneHoliday: IHoliday = { id: '', name: '', description: '' }; //for showing one holiday
  showId: string = ''; //id of required holiday to be shown
  newHoliday: IHoliday = { id: '', name: '', description: '' }; // for adding a new holiday
  editedHoliday: IHoliday = { id: '', name: '', description: '' }; // for editing a holiday
  response:any;

  constructor(private holidaysService: OfficialHolidaysService) { }
  
  // get all
  getAllHolidays(): void {
    this.holidaysService.getAllHolidays().subscribe(
      (data) => {
        this.holidays = data;
      }
    );
  }
  // get one
  getHolidayById(holidayId: string): void {
    this.holidaysService.getHolidayById(holidayId).subscribe(
      (data) => {
        this.oneHoliday = data;
        this.response=data;
      }
    );
  }
  // add one
  addHoliday(): void {
    this.holidaysService.addHoliday(this.newHoliday).subscribe(
      (data) => {
        this.getAllHolidays(); // refresh the list
        this.newHoliday = { id: '', name: '', description: '' }; // clear the form
        this.response=data;
      }
    );
  }
  // update one
  updateHoliday(holidayId: string): void {
    this.holidaysService.updateHoliday(holidayId, this.editedHoliday).subscribe(
      (data) => {
        this.getAllHolidays(); // refresh the list
        this.response=data;
      }
    );
  }
  // delete one
  deleteHoliday(holidayId: string): void {
    this.holidaysService.deleteHoliday(holidayId).subscribe(
      (data) => {
        this.getAllHolidays(); // refresh the list
        this.response=data;
      }
    );
  }
}
