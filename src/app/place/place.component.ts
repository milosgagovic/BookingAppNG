import { Component, OnInit } from '@angular/core';
import {Place} from "./place.model"
import {Region} from "../region/region.model"
import { Http, Response } from '@angular/http';
import {HttpPlaceService} from "./place.service"
import { Observable } from "rxjs/Observable";

@Component({
  selector: 'app-place',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.css'],
  providers: [HttpPlaceService]
})
export class PlaceComponent implements OnInit {

  private places:Array<Place>;
  private editFlag;
  place:any;

  constructor(private httpPlaceService:HttpPlaceService) {
  }

  ngOnInit() {
    this.editFlag=false;
    this.httpPlaceService.getPlaces().subscribe(
      (res: any) => {this.places = res; console.log(this.places)},
      error => {alert("Unsuccessful fetch operation!"); console.log(error);}
    );
  }

  getNotification(evt) {
      this.ngOnInit();
  }

  editClick(place:Place){
    this.editFlag=true;
    this.place=place;
  }

  delete(place:Place){

    this.httpPlaceService.deletePlace(place.Id).subscribe(
      ()=>{
      console.log('Place ' + place.Name + ' successfuly deleted');
      this.ngOnInit();
      },
      error=>{alert("Place ' + place.Name + ' failed delete!"); console.log(error);}
    );
  }

}
