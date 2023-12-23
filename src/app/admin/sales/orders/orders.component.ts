import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Order } from 'src/app/app.models';
import { AppService } from 'src/app/app.service';
import { OrderDetailsDialogComponent } from 'src/app/shared/order-details-dialog/order-details-dialog.component';
import { InvoiceComponent } from '../../invoice/invoice.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  public form:FormGroup;
  public today = new Date();
  displayedColumns: string[] = ['id', 'date', "rider",'status.name', 'total', 'action', 'view'];
  dataSource!: MatTableDataSource<Order>;
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  public statuses = [
    { id: 0, name: 'Order Placed',roles:[1,3] },
    { id: 1, name: 'Accepted' ,roles:[1,3]},
    { id: 2, name: 'Processing' ,roles:[1,3]},
    { id: 3, name: 'On Hold' ,roles:[1,3]},
    { id: 4, name: 'Out for Delivery' ,roles:[1,3]},
    { id: 5, name: 'Delivered' ,roles:[1,3]},
    { id: 6, name: 'Rejected' ,roles:[1,3]},
    { id: 7, name: 'N/A' ,roles:[1,3]},
    { id: 8, name: 'Packed and ready for allocation' ,roles:[1,3]}

  ];
  public delivery_status = [
    {'name':'Order Placed','status_icon':'order-placed.png'},
    {'name':'Accepted','status_icon':'accept.png'},
    {'name':'Processing','status_icon':'processing.png'},
    {'name':'On Hold','status_icon':'hold.png'},
    {'name':'Out for Delivery','status_icon':'out-for-delivery.png'},
    {'name':'Delivered','status_icon':'delivered.png'},
    {'name':'Rejected','status_icon':'cancel.png'},
    {'name':'N/A','status_icon':''},
    {'name':'Packed and ready for allocation','status_icon':'ballot'}
  ]
  riders: any;
  invoiceData: any;
  chefs: any;
  communities: any;
  constructor(public router:Router,public dialog: MatDialog,public appService:AppService, public snackBar: MatSnackBar,public fb: FormBuilder) { 
    this.form = this.fb.group({
      chef: null,
      community :null,
      rider: null,
      status: null,  
      date: null,
      role: this.appService.UserData.profile.role_id,
      chef_id: this.appService.UserData.profile.id
    });
    // let ordersFilterData = localStorage.getItem('ordersFilterData');
    // if (ordersFilterData && ordersFilterData != null && ordersFilterData !== 'null') {  
    //    this.form.patchValue(JSON.parse(ordersFilterData));
    // }else{
    //   //this.UserData =new UserData([], []);
    // }
  }

  ngOnInit(): void {
    this.getChefs();
    this.getRiders();
    this.getOrders();
    this.getCommunities();
    
    if(this.appService.UserData.profile.role_id == 1){
     // this.displayedColumns.splice(2, 0, "rider");
      //this.displayedColumns.push('rider');
    } 
  }
  checkStatus(order : any,id:any,roles : any){
    if(order.orderstatus.find((item : any) => item.status == id) || !roles.includes(this.appService.UserData.profile.role_id)){
      return true;
    }
    return false;
  }
  public getOrders(){

    this.appService.getOrders(this.form.value).subscribe((orders:any) => { 
      console.log(orders.data.orders);
      this.initDataSource(orders.data.orders);
    });
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
  public assignRider(event:any, order:any){
    const params= {
      id : order.id,
      rider_id :event.value
    } 
    this.appService.assignRider(params).subscribe((data:any) => { 
      if(data.status == 200){
        const params= {
          id : order.id,
          status : 4
        } 
        this.appService.updateStatus(params).subscribe((data:any) => { 
          if(data.status == 200){
            this.getOrders();
            this.snackBar.open('Rider assigned updated successfully!', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
            this.dataSource.data.find(item => item.id == order.id)!.status = event.value.id; 
            console.log(this.dataSource.data); 
            this.initDataSource(this.dataSource.data);
            this.snackBar.open('Order status updated successfully!', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
          }
          
        });
        
      }
      
    });
  }
  public onStatusSelectionChange(event:any, order:any){ 
    console.log(event); 
    if(event.value){ 
      const index: number = this.dataSource.data.indexOf(order);    
      if(index !== -1) {
        const params= {
          id : order.id,
          status :event.value.id
        } 
        this.appService.updateStatus(params).subscribe((data:any) => { 
          if(data.status == 200){
            this.dataSource.data.find(item => item.id == order.id)!.status = event.value.id; 
            console.log(this.dataSource.data); 
            this.initDataSource(this.dataSource.data);
            this.snackBar.open('Order status updated successfully!', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
          }
          
        });
        
      }  
    }
  }

  public view(order:Order){ 
    const dialogRef = this.appService.openDialog(OrderDetailsDialogComponent, order, 'theme-dialog');
    dialogRef.afterClosed().subscribe(data => {  
      if(data){ 
          
      } 
    });  
  }

  public receipt(order:any){
    console.log(order); 
    this.appService.orderInvoice(order.chef_order_id).subscribe((invoice:any) => { 
      console.log(invoice);
      let dialogRef = this.dialog.open(InvoiceComponent, {
        height: '80%',
        data: JSON.stringify(invoice)
    });

    dialogRef.afterClosed().subscribe(invoice => {
        
    });


       
      // this.invoiceData = data;
      // const originalContents = document.body.innerHTML;
      // document.body.innerHTML = data;
      // const printContents = document.body.innerHTML;
      // window.print();
      // this.ngOnInit();
      // document.body.innerHTML = originalContents;
      
    });
  } 
  public submit(){
    localStorage.setItem('ordersFilterData', JSON.stringify(this.form.value));
    this.getOrders(); 
  }
  public resetFilter(){
    this.form.reset();
    localStorage.setItem('ordersFilterData', JSON.stringify(this.form.value));
    this.getOrders();
  } 

}
