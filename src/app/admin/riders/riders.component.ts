import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppSettings, Settings } from '../../app.settings';
import { RidersService } from './riders.service';
import { AppService } from 'src/app/app.service';
import { RiderDialogComponent } from './rider-dialog/rider-dialog.component';

@Component({
  selector: 'app-riders',
  templateUrl: './riders.component.html',
  styleUrls: ['./riders.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ RidersService ] 
})
export class RidersComponent implements OnInit {
    public riders: any;
    public searchText: string = '';
    public page:any;
    public settings: Settings;
    public maxSize:number = 5;
    public autoHide:boolean = true;
    constructor(public appSettings:AppSettings, 
                public dialog: MatDialog,
                public appService:AppService,
                public ridersService:RidersService){
        this.settings = this.appSettings.settings; 
    }

    ngOnInit() {
        this.getRiders();         
    }

    public getRiders() {
        this.riders = []; //for show spinner each time
        const params ={
            role : 4
        }
        this.appService.getUsers(params).subscribe((riders : any) => {
            console.log(riders);
            if(riders.data.users.length && riders.status== 200){
              this.riders = riders.data.users;
            }else{
              this.riders = [];
            }
            
        });    
    }
    public addRider(rider:any){
      this.appService.registerRider(rider).subscribe(rider => this.getRiders());
    }
    public updateRider(user:any){
        this.ridersService.updateRider(user).subscribe(rider => this.getRiders());
    }
    public deleteRider(user:any){
      //this.usersService.deleteUser(user.id).subscribe(rider => this.getRiders());
    }
    public onPageChanged(event:any){
        this.page = event;
        this.getRiders();
        window.scrollTo(0,0);
        // if(this.settings.fixedHeader){      
        //     document.getElementById('main-content').scrollTop = 0;
        // }
        // else{
        //     document.getElementsByClassName('mat-drawer-content')[0].scrollTop = 0;
        // }
    }

    public openRiderDialog(rider:any | null){
        let dialogRef = this.dialog.open(RiderDialogComponent, {
            data: rider
        });
        dialogRef.afterClosed().subscribe(rider => {
          if(rider){
              this.getRiders();
          }
      });
    }

}