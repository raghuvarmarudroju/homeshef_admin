import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';  
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table'; 
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'src/app/app.models';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-business-stock',
  templateUrl: './business-stock.component.html',
  styleUrls: ['./business-stock.component.scss']
})
export class BusinessStockComponent implements OnInit {

  public form!: FormGroup;
  private sub: any;
  public id:any;
  public today = new Date();
  public showImage:boolean = false;
  
  displayedColumns: string[] = ['id', 'name', 'availibilityCount', 'isVegetarian'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;

  constructor(public dialogRef: MatDialogRef<BusinessStockComponent>,
    @Inject(MAT_DIALOG_DATA) public product_id: any,public appService:AppService,public formBuilder: FormBuilder,private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    
    this.getStock(this.product_id);
  }

  public initDataSource(data:any){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;  
  }  

  public getCategories(){
    if(!this.appService.Data.categories.length){
      this.appService.getCategories().subscribe(categories=>{ 
        this.appService.Data.categories = categories;
      });
    } 
  } 

  public getStock(id :any){
    const param = {
      product_id: id,
    };  
    this.appService.businessStock(param).subscribe((data:any) => { 
      if (data && data.status == 200 && data.data.length) {
        this.initDataSource(data.data);
      }
       
    }); 
  }
}
