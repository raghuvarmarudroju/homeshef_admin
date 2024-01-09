import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator'; 
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app/app.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { DetailsDialogComponent } from './../details-dialog/details-dialog.component';
import { ChefDialogComponent } from '../chef-dialog/chef-dialog.component';

@Component({
  selector: 'app-approvals',
  templateUrl: './approvals.component.html',
  styleUrls: ['./approvals.component.scss']
})
export class ApprovalsComponent implements OnInit {
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
        this.initDataSource(users.data.users);
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
    if(status == 0){
      return 'Pending';
    }else if(status == 1){
      return 'Approved';
    }else{
      return 'Rejected';
    }
    
  }
  public view(chef:any){
    const dialogRef = this.appService.openDialog(DetailsDialogComponent, chef, 'theme-dialog');
    dialogRef.afterClosed().subscribe(data => {  
      if(data){ 
         
      } 
    }); 
  }
  public approve(item:any){ 
    var user = {
      id : item.id,
        status : 1
    }
    this.appService.updateChefApproval(user).subscribe((user : any) => {
      this.snackBar.open('Chef Approved', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 }); 
      this.getChefs();
    });
  }

  public reject(item:any){ 
    var user = {
      id : item.id,
        status : 2
    }
    this.appService.updateChefApproval(user).subscribe((user : any) => {
      this.snackBar.open('Chef Rejected', '×', { panelClass: 'error', verticalPosition: 'top', duration: 3000 }); 
      this.getChefs();
    });
  }
}
