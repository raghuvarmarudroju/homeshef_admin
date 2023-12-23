import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';  
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table'; 
import { MenuItem } from 'src/app/app.models';
import { AppService } from 'src/app/app.service';
import { BusinessStockComponent } from '../business-stock/business-stock.component';
import { StoreStockComponent } from '../store-stock/store-stock.component';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit {
  public form!: FormGroup;
  private sub: any;
  public id:any;
  public today = new Date();
  public showImage:boolean = false;
  
  displayedColumns: string[] = ['id', 'name', 'availibilityCount', 'isVegetarian'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  file: any;
  @Input('base64') base64:string = ''; 
  @Input('fileSize') fileSize = 50000;  
  @Input('acceptTypes') acceptTypes:any; 
  @Output() onFileChange: EventEmitter<any> = new EventEmitter(); 
  @Output() onFileUploadClick: EventEmitter<any> = new EventEmitter();
  public files:any[] = [];
  public isFromStore: boolean = false;
  public isToStore: boolean = false;
  constructor(public appService:AppService,public formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({ 
      "from_business_type": null,
      "from_store_id": null,
      "file": null,  
      "date": [null, Validators.required ], 
      "categoryId": [null, Validators.required ]   
    });
   }

  ngOnInit(): void {
    this.getStock();
    this.getStores();
    
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

  public getStock(){  
    this.appService.getStockk(1,this.form.value).subscribe((data:any) => { 
      if (data && data.status == 200 && data.data.length) {
        this.initDataSource(data.data);
      }else{
        this.initDataSource([]);
      }
       
    }); 
  }
  fromBusinessChanged(event :any) {
    if(event == 'b2c'){
      this.isFromStore = true;
    }else if(event != 'b2c' && event != ''){
      this.isFromStore = false;
      //this.initDataSource([]);
      this.getBusinessStock();
    }else{
      //this.initDataSource([]);
      this.getStock();
    }
  }
  fromStoreChanged(event :any) {
    if(event != ''){
      //this.initDataSource([]);
      this.getStoreStock();
    }
  }
  toBusinessChanged(event :any) {
    if(event == 'b2c'){
      this.isToStore = true;
    }else{
      this.isToStore = false;
    }
  }
  public getBusinessStock(){  
    this.appService.getStockk(2,this.form.value).subscribe((data:any) => { 
      if (data && data.status == 200 && data.data.length) {
        this.initDataSource(data.data);
      }else{
        this.initDataSource([]);
      }
       
    }); 
  }
  public getStoreStock(){  
    this.appService.getStockk(3,this.form.value).subscribe((data:any) => { 
      if (data && data.status == 200 && data.data.length) {
        this.initDataSource(data.data);
      }else{
        this.initDataSource([]);
      }
       
    }); 
  }
  public remove(menuItem:MenuItem) {
    const index: number = this.dataSource.data.indexOf(menuItem);    
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
  public getStores(){
    this.appService.getStores().subscribe(categories=>{ 
      this.appService.Data.stores = categories;
      console.log(categories);
    }); 
  }
  public onSubmit(){
    console.log(this.form.value);

    const formData = new FormData();
    formData.append('file', this.form.controls.file.value);
    formData.append('date', this.form.controls.date.value);
    formData.append('categoryId', this.form.controls.categoryId.value);

    this.appService.updateStock(formData).subscribe(stock=>{ 
      if (stock && stock.status == 200 ) {
        this.getStock();
        this.form.controls.file.patchValue(null);
        this.files = [];
      }
    });
  }
  public fileChanxge(files:any){ 
    console.log(files)
    if(files.length){
      this.form.controls.file.patchValue(files[0].content);
      this.file =  files[0];
    } 
    else{
      this.form.controls.file.patchValue(null); 
    }
  }
  onFileSelect(event :any) {
    let af = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
    if (event.target.files.length > 0) {
      const file = event.target.files[0];

      this.form.controls.file.patchValue(file);
      this.files.push({
        "name": event.target.files[0].name
      });
      console.log(file);
    }
  }
  public fileChange(input:any){ 
    console.log(input); 
    if(input.files.length){
      for (var i = 0; i < input.files.length; i++){
        const reader = new FileReader(); 
        if (input.files[i].size / 1024 > this.fileSize) {  
          const message = this.appService.getTranslateValue('MESSAGE.FILE_SIZE', this.fileSize.toString()); //'The file size cannot exceed '+this.fileSize.toString()+' kb.';
          let dialogRef = this.appService.openAlertDialog(message!); 
          dialogRef.afterClosed().subscribe(dialogResult => {
            this.clearInput();  
          });  
        } 
        else {  
          let name = input.files[i].name;
          let size = input.files[i].size; 
          reader.readAsDataURL(input.files[i]);
          reader.onload = (e: any) => { 
            console.log(e.target.result); 
            this.files.push({
              "name": name, 
              "size": size, 
              "content": e.target.result 
            }); 
            this.onFileChange.emit(this.files); 
            //img.src = reader.result as string; 
          } 
        }  
      }
      this.form.controls.file.patchValue(this.files[0].content);
    }  
  }
   
  public fileUploadClick(){ 
    this.onFileUploadClick.emit();
  }

  public clearInput(){
    if(this.files.length == 0){  
      if(document.getElementById('singleFileUploader')){ 
        (<HTMLInputElement>document.getElementById('singleFileUploader')).value = ''; 
      }
    }  
  } 

  public deleteFile() {  
    const message = this.appService.getTranslateValue('MESSAGE.SURE_DELETE');
    let dialogRef = this.appService.openConfirmDialog('', message!);
    dialogRef.afterClosed().subscribe(dialogResult => {
      if(dialogResult){
        this.files.length = 0;          
        this.onFileChange.emit(this.files);
        this.clearInput();   
      }
    });  
  }

  public openBusinessDialog(product_id:any | null){
    const dialogRef = this.appService.openDialog(BusinessStockComponent, product_id, 'theme-dialog');
    dialogRef.afterClosed().subscribe(stock => {  

    });  
  }
  public openStoreDialog(product_id:any | null){
    const dialogRef = this.appService.openDialog(StoreStockComponent, product_id, 'theme-dialog');
    dialogRef.afterClosed().subscribe(stock => {  

    });  
  }
}
