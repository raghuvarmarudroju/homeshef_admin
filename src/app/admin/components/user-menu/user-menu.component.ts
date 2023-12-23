import { Component, EventEmitter, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { CustomerDialogComponent } from '../../customers/customer-dialog/customer-dialog.component';
import { ProfileDialogComponent } from '../profile-dialog/profile-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {
  public userImage = 'assets/images/others/user.jpg';
  public userName:string='';
  public data: any;
  @Output() onProfileUpdate = new EventEmitter<any>();
  constructor(public appService:AppService, public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.appService.profile({id:this.appService.UserData.profile.id}).subscribe((res) => {
      this.data = res.data;
      this.userName = res.data.name;
      console.log(this.data);
      this.userImage = res.data.avatar!=''?res.data.avatar:'assets/images/others/user.jpg';
    });
  }
  /*
  public openCustomerDialog(customer:any){
    let data = {
      customer: customer,
      stores: this.stores,
      countries: this.countries
    };
    const dialogRef = this.appService.openDialog(CustomerDialogComponent, data, 'theme-dialog');
    dialogRef.afterClosed().subscribe(cus => {  
      if(cus){
        let message = '';      
        const index: number = this.dataSource.data.findIndex(x => x.id == cus.id); 
        if(index !== -1){
          this.dataSource.data[index] = cus;
          message = 'Customer '+cus.firstName+ ' ' +cus.lastName+' updated successfully';
        } 
        else{ 
          let last_customer = this.dataSource.data[this.dataSource.data.length - 1]; 
          cus.id = last_customer.id + 1; 
          this.dataSource.data.push(cus); 
          this.paginator.lastPage();
          message = 'New customer '+cus.firstName+ ' ' +cus.lastName+' added successfully!'; 
        }  
        this.initDataSource(this.dataSource.data); 
        this.snackBar.open(message, '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });          
      }
    });  
  }
  */
  public openProfileDialog(){
   
    let data = {
      id: this.data.id,
      name: this.data.name,
      avatar: this.data.avatar,
      //type: this.data.type,
      email: this.data.email,
      number: this.data.number,
      city: this.data.city,
      house: this.data.house,
      landmark: this.data.landmark,
      address: this.data.address,
      lat: this.data.lat,
      lng: this.data.lng
    };
  
    const dialogRef = this.appService.openDialog(ProfileDialogComponent, data, 'theme-dialog');
    dialogRef.afterClosed().subscribe((res) => {
      if(res) {
        console.log('hoooof');
        console.log(res);
        this.appService.updateProfile(res).subscribe((res) => {
          if(res.status==200) {
            console.log(res.data);
            this.userImage = res.data.avatar!=''?res.data.avatar:'assets/images/others/user.jpg';
            this.userName = res.data.name;
            this.data = res.data;
            this.onProfileUpdate.emit(res.data);
            this.snackBar.open('Profile has been updated successfully!', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
          }
        })
      }
    })
  }

}
