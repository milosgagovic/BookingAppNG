import { Component, OnInit } from '@angular/core';
import {Country} from "../country/country.model"
import {Region} from "./region.model"
import { Http, Response } from '@angular/http';
import {HttpRegionService} from "./region.service"
import { Observable } from "rxjs/Observable";

@Component({
  selector: 'app-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.css'],
  providers:[HttpRegionService]
})
export class RegionComponent implements OnInit {

  private regions:Array<Region>;
  private editFlag;
  region:any;

  constructor(private httpRegionService:HttpRegionService) { }

  ngOnInit() {
    this.editFlag=false;
    this.httpRegionService.getRegions().subscribe(
      (res: any) => {this.regions = res; console.log(this.regions)},
      error => {alert("Unsuccessful fetch operation!"); console.log(error);}
    );
  }

  getNotification(evt) {
      this.ngOnInit();
  }

  editClick(region:Region){
    this.editFlag=true;
    this.region=region;
  }

  delete(region:Region){

    this.httpRegionService.deleteRegion(region.Id).subscribe(
      ()=>{
      console.log('Region ' + region.Name + ' successfuly deleted');
      this.ngOnInit();
      },
      error=>{alert("Region ' + region.Name + ' failed delete!"); console.log(error);}
    );
  }

}
