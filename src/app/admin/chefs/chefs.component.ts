import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator'; 
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app/app.service';
import { ChefDialogComponent } from './chef-dialog/chef-dialog.component';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { DetailsDialogComponent } from './details-dialog/details-dialog.component';

@Component({
  selector: 'app-chefs',
  templateUrl: './chefs.component.html',
  styleUrls: ['./chefs.component.scss']
})
export class ChefsComponent implements OnInit {
  displayedColumns: string[] = ['fullName', 'username', 'email', 'storeId', 'walletBalance', 'revenue', 'actions'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  public stores = [
    { id: 1, name: 'Store 1' },
    { id: 2, name: 'Store 2' }
  ]
  public countries:any[] = [];

  constructor(public appService:AppService, public snackBar: MatSnackBar) { }

  ngOnInit(): void { 
    this.countries = this.appService.getCountries();
    this.getChefs(); 
  }

  public initDataSource(data:any){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort; 
  } 

  public remove(chef:any) {
    const index: number = this.dataSource.data.indexOf(chef);    
    if (index !== -1) {
      const message = this.appService.getTranslateValue('MESSAGE.SURE_DELETE');
			let dialogRef = this.appService.openConfirmDialog('', message!);
			dialogRef.afterClosed().subscribe(dialogResult => {
				if(dialogResult){ 
          this.dataSource.data.splice(index,1);
          this.initDataSource(this.dataSource.data); 
				}
			});  
    } 
  }  
  public getChefs() {
    const params ={
        role : 3
    }
    this.appService.getUsers(params).subscribe((users : any) => {
        console.log(users);
        this.initDataSource(users.data.users.filter((item:any) => item.is_verified == 1));
    });    
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
  public getStatus(status: any) {
    if(status == 1){
      return true;
    }
    return false;
  }
  public getVerificationStatus(status: any) {
    if(status == 0){
      return 'Pending';
    }else if(status == 1){
      return 'Approved';
    }else{
      return 'Rejected';
    }
    
  }
  public openChefDialog(chef:any){
    let data = {
      chef: chef,
      stores: this.stores,
      countries: this.countries
    };
    const dialogRef = this.appService.openDialog(ChefDialogComponent, data, 'theme-dialog');
    dialogRef.afterClosed().subscribe(cus => {  
      if(cus){
        let message = '';      
        const index: number = this.dataSource.data.findIndex(x => x.id == cus.id); 
        if(index !== -1){
          this.dataSource.data[index] = cus;
          message = 'Chef '+cus.firstName+ ' ' +cus.lastName+' updated successfully';
        } 
        else{ 
          let last_chef = this.dataSource.data[this.dataSource.data.length - 1]; 
          cus.id = last_chef.id + 1; 
          this.dataSource.data.push(cus); 
          this.paginator.lastPage();
          message = 'New chef '+cus.firstName+ ' ' +cus.lastName+' added successfully!'; 
        }  
        this.initDataSource(this.dataSource.data); 
        this.snackBar.open(message, '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });          
      }
    });  
  }
  public view(chef:any){
    const dialogRef = this.appService.openDialog(DetailsDialogComponent, chef, 'theme-dialog');
    dialogRef.afterClosed().subscribe(data => {  
      if(data){ 
         
      } 
    }); 
  }

}
