import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import {RoomReservation} from "../roomreservation.model"
import { Http, Headers, Response } from '@angular/http';
import {HttpRoomReservationService} from "../roomreservation.service"
import {HttpRoomService} from "app/room/room.service";
import { Observable } from "rxjs/Observable";
import { FormsModule } from '@angular/forms';
import {NgForm} from '@angular/forms';
import {AppUrl} from "app/appservice/AppUrl.services"
import {Router, ActivatedRoute} from '@angular/router';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import {Room} from "app/room/room.model";
import{MdSnackBar} from '@angular/material'
@Component({
  selector: 'app-room-reservation-add',
  templateUrl: './room-reservation-add.component.html',
  styleUrls: ['./room-reservation-add.component.css'],
  providers: [HttpRoomReservationService,HttpRoomService]
})
export class RoomReservationAddComponent implements OnInit {

public nRoomReservation: any={};
@Input() roomForCheckReserv:Room;
@Output() notifyParent: EventEmitter<any> = new EventEmitter();
public rooms : Array<Room>;
constructor(private httpRoomResService:HttpRoomReservationService,private httpRoomService : HttpRoomService,private router: Router,
public snackBar: MdSnackBar) {
    this.notifyParent=new EventEmitter();
  }

  ngOnInit() {
     this.httpRoomService.getRooms().subscribe((res: any) => {
        this.rooms = res; console.log(this.rooms);
      },
        error => {alert("Unsuccessful fetch operation!"); console.log(error);}
      );
  }

 saveRoomReservation(roomRes: RoomReservation, form: NgForm,room:Room){
      roomRes.Room_Id = room.Id;
      var date = new Date();
      if (date > roomRes.StartDate)
      {
        this.openSnackBar("Start date cant be later then current date","");
        return;
      }
      if (roomRes.EndDate < roomRes.StartDate)
      {
        this.openSnackBar("End date must be later or equal then start date","");
        return;
      }
      var g = false;

      g = this.checkRoomReservations(room,roomRes);

      if (g)
      {
       this.httpRoomResService.postRoomReservations(roomRes).subscribe(
          ()=>{ 
            console.log('RoomRes successfuly posted');
            this.router.navigate(['/room-reservation']);
            this.openSnackBar("Succesfuly reserve","");
            
          },
          error => {alert("Close!"); console.log(error);}
        );
        this.ngOnInit();
        this.notifyParent.emit('Some value to send to the parent');
      }
      else 
      {
         this.openSnackBar("Another user is reserved this room in this period","");
      }
        
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2500,
    });
  }

  checkRoomReservations(room:Room,roomRes:RoomReservation):boolean{
    if (room.RoomReservations.length == 0)
    {
      return true;
    }
    var res = false;
     room.RoomReservations.forEach(element => {
          var sd = element.StartDate.toString();
          var k = sd.split('T');
          var sdCom = new Date(k[0]);
          
          var ed = element.EndDate.toString();
          var k = ed.split('T');
          var edCom = new Date(k[0]);
                              /// provera da li se datumi rezervacije preklapaju
        if ((roomRes.StartDate >= sdCom && roomRes.StartDate <= edCom) ||
                 (roomRes.EndDate >=sdCom && roomRes.EndDate <=edCom))
        {
            return res = false;
        }
        else 
        {
            res = true;
        }
      });
      return res;
  }
}
