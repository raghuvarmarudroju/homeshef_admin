import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Order } from 'src/app/app.models';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-order-details-dialog',
  templateUrl: './order-details-dialog.component.html',
  styleUrls: ['./order-details-dialog.component.scss']
})
export class OrderDetailsDialogComponent implements OnInit {
  public deliveryAddress = {
    'firstName': 'Emilio',
    'lastName': 'Verdines',
    'middleName': '', 
    'company': '',
    'email': 'emilio.verdines@gmail.com',
    'phone': '(+100) 123 456 7890', 
    'country': 'US',
    'city': 'New York',
    'place': 'Brooklyn',
    'postalCode': '11213',
    'address': '1568 Atlantic Ave',
    'id': 1
  }
  public statuses = [
    { id: 0, name: 'Order Placed',icon:'done' },
    { id: 1, name: 'Accepted',icon:'done' },
    { id: 2, name: 'Processing' ,icon:'timer'},
    { id: 3, name: 'On Hold' ,icon:'pause_circle_filled'},
    { id: 8, name: 'Packed and Ready for allocation' ,icon:'card_giftcard'},
    { id: 4, name: 'Out for Delivery' ,icon:'directions_bike'},
    { id: 5, name: 'Delivered' ,icon:'event_available'},
    { id: 6, name: 'Rejected' ,icon:'cancel'}

  ];
  constructor(public dialogRef: MatDialogRef<OrderDetailsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public order: any,public appService:AppService) { }
 

  ngOnInit(): void {
    console.log(this.order);
  }
  checkStatus(id:any){
    if(this.order.orderstatus.find((item : any) => item.status == id) ){
      return true;
    }
    return false;
  }
  checkStatuss(id:any){
    if(id == 3 || id == 6){
      if(this.order.orderstatus.find((item : any) => item.status == id) ){
        return true;
      }
      return false;
    }
    return true;
  }

}
