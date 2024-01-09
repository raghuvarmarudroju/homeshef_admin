import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppSettings, Settings } from '../../app.settings';
import { User } from './user.model';
import { UsersService } from './users.service';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { AppService } from 'src/app/app.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ UsersService ]  
})
export class UsersComponent implements OnInit {
    public users: any =[];
    public searchText: string = '';
    public page:any;
    public settings: Settings;
    public maxSize:number = 5;
    public autoHide:boolean = true;
    constructor(public appSettings:AppSettings, 
                public dialog: MatDialog,
                public appService:AppService,
                public usersService:UsersService){
        this.settings = this.appSettings.settings; 
    }

    ngOnInit() {
        this.getUsers();         
    }

    public getUsers() {
        //this.users = []; //for show spinner each time
        const params ={
            role : 3
        }
        this.appService.getUsers(params).subscribe((users : any) => {
            console.log(users);
            this.users = users.data.users
        });    
    }
    public addUser(user:User){
        this.appService.registerChef(user).subscribe(user => this.getUsers());
    }
    public updateUser(user:User){
        this.appService.updateChef(user).subscribe(user => this.getUsers());
    }
    public updateUserStatus(user:User){
        this.appService.updateChefStatus(user).subscribe(user => this.getUsers());
    }
    public deleteUser(user:User){
       //this.usersService.deleteUser(user.id).subscribe(user => this.getUsers());
    }


    public onPageChanged(event:any){
        this.page = event;
        this.getUsers();
        window.scrollTo(0,0);
        // if(this.settings.fixedHeader){      
        //     document.getElementById('main-content').scrollTop = 0;
        // }
        // else{
        //     document.getElementsByClassName('mat-drawer-content')[0].scrollTop = 0;
        // }
    }
    public toggle(event: MatSlideToggleChange,id: any) {
        var user = {
            id : id,
            status : event.checked
        }
        this.appService.updateChefStatus(user).subscribe((user : any) => {
            console.log(user);
        });
    }
    public openUserDialog(user:any | null){
        if(user){
            user.address = user.chef_address;
        }
        let dialogRef = this.dialog.open(UserDialogComponent, {
            height: '80%',
            width: '80%',
            data: user
        });

        dialogRef.afterClosed().subscribe(user => {
            if(user){
                (user.id) ? this.updateUser(user) : this.addUser(user);
            }
        });
    }

}