import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import {Accommodation} from "../accommodation.model"
import {Place} from 'app/place/place.model'
import {AccomodationType} from 'app/accomodationtype/accomodationtype.model'
import { Http, Headers, Response } from '@angular/http';
import {HttpPlaceService} from 'app/place/place.service'
import {HttpAccommodationService} from 'app/accomodation/accommodation.service'
import {HttpAccomodationTypeService} from 'app/accomodationtype/accomodationtype.service'
import { Observable } from "rxjs/Observable";
import { FormsModule } from '@angular/forms';
import {NgForm} from '@angular/forms';
import {AppUrl} from "app/appservice/AppUrl.services"
import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-accommodation-edit',
  templateUrl: './accommodation-edit.component.html',
  styleUrls: ['./accommodation-edit.component.css'],
  providers:[HttpPlaceService,HttpAccommodationService,HttpAccomodationTypeService]
})
export class AccommodationEditComponent implements OnInit {

  @Input() eAccommodation:Accommodation;
  private accommodationForEdit:Accommodation;
  public places: Array<Place>;
  public accommodationTypes:Array<AccomodationType>;
  @Output() notifyParent: EventEmitter<any> = new EventEmitter();

  constructor(private httpPlaceService:HttpPlaceService,
              private httpAccommodationService:HttpAccommodationService,
              private httpAccommodationTypeService:HttpAccomodationTypeService,
              private router:Router) { }

  ngOnInit() {
    this.httpAccommodationTypeService.getAccomodationTypes().subscribe((res: any) => {
        this.accommodationTypes = res; console.log(this.accommodationTypes);
      },
        error => {alert("Unsuccessful fetch operation!"); console.log(error);}
      );
      this.httpPlaceService.getPlaces().subscribe((res: any) => {
        this.places = res; console.log(this.places);
      },
        error => {alert("Unsuccessful fetch operation!"); console.log(error);}
      );
  }

  editAccommodation(accommodation: Accommodation, form: NgForm){
    
      this.accommodationForEdit=new Accommodation();
      this.accommodationForEdit.Id=this.eAccommodation.Id;
      this.accommodationForEdit.Name=accommodation.Name;
      this.accommodationForEdit.Address=accommodation.Address;
      this.accommodationForEdit.AccommodationType_Id=accommodation.AccommodationType_Id;
      this.accommodationForEdit.AppUser_Id=this.eAccommodation.AppUser_Id;
      this.accommodationForEdit.AverageGrade=accommodation.AverageGrade;
      this.accommodationForEdit.Description=accommodation.Description;
      this.accommodationForEdit.ImageURL=accommodation.ImageURL;
      this.accommodationForEdit.Latitude=accommodation.Latitude;
      this.accommodationForEdit.Longitude=accommodation.Longitude;
      this.accommodationForEdit.Place_Id=accommodation.Place_Id;
      this.accommodationForEdit.Approved=accommodation.Approved;

      this.httpAccommodationService.editAccommodation(this.accommodationForEdit).subscribe(
          ()=>{ 
            console.log('Accommodation successfuly edited');
            this.notifyParent.emit('Some value to send to the parent');
          },
          error => {alert("Close!"); console.log(error);}
        );
       
  }

}
