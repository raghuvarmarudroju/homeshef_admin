import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator'; 
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Order } from 'src/app/app.models';
import { AppService } from 'src/app/app.service';
import { OrderDetailsDialogComponent } from 'src/app/shared/order-details-dialog/order-details-dialog.component';
import { withdrawal } from './withdrawal';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-withdrawal',
  templateUrl: './withdrawal.component.html',
  styleUrls: ['./withdrawal.component.scss']
})
export class WithdrawalComponent implements OnInit {
  public form:FormGroup;
  displayedColumns: string[] = ['invoiceId', 'orderIds', 'chef', 'amount', 'charges', 'payment', 'date', 'actions'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  public stores = [
    { id: 1, name: 'Store 1' },
    { id: 2, name: 'Store 2' }
  ];
  public statuses = [
    { id: 0, name: 'Pending',roles:[1,3] },
    { id: 1, name: 'Tranfered' ,roles:[1,3]},
    { id: 2, name: 'Rejected' ,roles:[1,3]},

  ];
  riders: any;
  communities: any;
  chefs: any;
  communityChefs: any=[];

  constructor(public appService:AppService,public fb: FormBuilder) { 
    this.form = this.fb.group({
      chef: null,
      community :null,
      status: null,  
      date: null,
      role: this.appService.UserData.profile.role_id,
      chef_id: this.appService.UserData.profile.id
    });
  }

  ngOnInit(): void {
    this.getChefs();
    this.getRiders();
    this.getCommunities();
    this.getWithdrawls();

    this.dataSource = new MatTableDataSource(withdrawal);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort; 
  }
  public initDataSource(data:any){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    (this.dataSource.sortingDataAccessor as any) = (data:any, sortHeaderId: string) => {
      return this.getPropertyByPath(data, sortHeaderId);
    };
  }
  getPropertyByPath(obj: Object, pathString: string) {
    return pathString.split('.').reduce((o:any, i) => o[i], obj);
  }
  public getRiders(){
    this.appService.getRiders().subscribe((riders:any) => { 
      this.riders = riders.data.riders.filter((item:any) => item.user_id != null);
      console.log(this.riders);
    }); 
  }
  public getCommunities(){
    this.appService.getCommunities().subscribe((community:any)=>{
      this.communities = community.communities;
    })
  }
  public getChefs(){
    const params ={
      role : 3
    }
    this.appService.getUsers(params).subscribe((users : any) => {
      console.log(users);
      this.chefs = users.data.users
    }); 
  }
  public getWithdrawls(){
    this.appService.getWithdrawls(this.form.value).subscribe((withdrawls:any) => { 
      console.log(withdrawls.data.withdrawls);
      this.initDataSource(withdrawls.data.withdrawls);
    });
  }
  onCommunitySelectionChange(event:any){ 
    console.log(event); 
    this.communityChefs = this.chefs.filter((item:any) => item.community_id == event );
  }

  public updateWithdrawls(){

    this.appService.updateWithdrawls(this.form.value.date).subscribe((withdrawls:any) => { 
      console.log(withdrawls);
    });
  }
  public viewOrder(order:Order){ 
    const dialogRef = this.appService.openDialog(OrderDetailsDialogComponent, order, 'theme-dialog');
    dialogRef.afterClosed().subscribe(data => {  
      if(data){ 
          
      } 
    });  
  }
  public resetFilter(){
    this.form.reset();
    localStorage.setItem('withdrawlsFilterData', JSON.stringify(this.form.value));
    this.getWithdrawls();
  } 
  public submit(){
    localStorage.setItem('withdrawlsFilterData', JSON.stringify(this.form.value));
    this.getWithdrawls(); 
  }
  public approve(item:any){ }

  public reject(item:any){ }

}
