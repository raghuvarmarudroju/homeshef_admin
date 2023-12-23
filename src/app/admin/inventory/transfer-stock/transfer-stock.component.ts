import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { AppService } from 'src/app/app.service';
import { MenuItem } from 'src/app/app.models';
import { ActivatedRoute } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-transfer-stock',
  templateUrl: './transfer-stock.component.html',
  styleUrls: ['./transfer-stock.component.scss']
})

export class TransferStockComponent implements OnInit {
  public form!: FormGroup;
  private sub: any;
  public id:any;
  public ee: any = null;
  public showImage:boolean = false;
  public isFromStore: boolean = false;
  public isToStore: boolean = false;

  constructor(public appService:AppService, 
              private formBuilder: FormBuilder,
              private fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              @Inject(PLATFORM_ID) private platformId: Object) { 
                this.form = this.fb.group({
                  from_business_type: null,
                  from_store_id: null,
                  business_type: [null, Validators.required ],
                  store_id: null, 
                  expiry_date: null,
                  products: this.fb.array([])
                });
              }

  ngOnInit(): void {  
    this.getStock();
    this.getStores();
    this.sub = this.activatedRoute.params.subscribe(params => {  
      if(params['id']){
        this.id = params['id'];
        this.getMenuItemById(); 
      } 
      else{
        this.showImage = true;
      }
    }); 
  }
  fromBusinessChanged(event :any) {
    if(event == 'b2c'){
      this.isFromStore = true;
    }else if(event != 'b2c' && event != ''){
      this.isFromStore = false;
      const arr = <FormArray>this.form.controls.products;
        arr.controls = [];
      this.getBusinessStock();
    }else{
      const arr = <FormArray>this.form.controls.products;
        arr.controls = [];
      this.getStock();
    }
  }
  fromStoreChanged(event :any) {
    if(event != ''){
      const arr = <FormArray>this.form.controls.products;
        arr.controls = [];
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
  products(): FormArray {
    return this.form.get('products') as FormArray;
  }

  newEmployee(qty : any,product_id: any,name: any): FormGroup {
    return this.fb.group({
      product_name: {disabled:false, value: name},
      product_id: product_id,
      available_qty: qty,
      transfer_qty: [0, [Validators.required, Validators.max(qty)]],
    });
  }

  addEmployee() {
    //this.employees().push(this.newEmployee());
  }
  addCreds(qty : any,product_id: any,name: any) {
    const creds = this.form.controls.credentials as FormArray;
    creds.push(this.formBuilder.group({
      product_name: {disabled:false, value: name},
      product_id: product_id,
      available_qty: qty,
      transfer_qty: 0,
    }));
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  } 
  public getStock(){  
    this.appService.getStockk(1,this.form.value).subscribe((data:any) => { 
      if (data && data.status == 200 && data.data.length) {
        data.data.forEach((element : any) => {
          console.log(element);
          this.products().push(this.newEmployee(element.ss,element.product_id,element.pname));
          //this.addEmployee();
        });
      }
       
    }); 
  }
  public getBusinessStock(){  
    this.appService.getStockk(2,this.form.value).subscribe((data:any) => { 
      if (data && data.status == 200 && data.data.length) {
        const arr = <FormArray>this.form.controls.products;
        arr.controls = [];
        data.data.forEach((element : any) => {
          console.log(element);
          this.products().push(this.newEmployee(element.ss,element.product_id,element.pname));
          //this.addEmployee();
        });
      }
       
    }); 
  }
  public getStoreStock(){  
    this.appService.getStockk(3,this.form.value).subscribe((data:any) => { 
      if (data && data.status == 200 && data.data.length) {
        const arr = <FormArray>this.form.controls.products;
        arr.controls = [];
        data.data.forEach((element : any) => {
          console.log(element);
          this.products().push(this.newEmployee(element.ss,element.product_id,element.pname));
          //this.addEmployee();
        });
      }
       
    }); 
  }
  public getStores(){
    this.appService.getStores().subscribe(categories=>{ 
      this.appService.Data.stores = categories;
      console.log(categories);
    }); 
  } 
  public getMenuItemById(){
    this.appService.getMenuItemById(this.id).subscribe((menuItem:MenuItem)=>{ 
      this.form.patchValue(menuItem); 
      if (isPlatformBrowser(this.platformId)) {
        this.appService.convertImgToBase64(menuItem.image.medium, (dataUrl:string) => { 
          this.showImage = true;
          this.form.controls.image.patchValue(dataUrl.toString());
        }) 
      }  
    });
  }

  public fileChange(files:any){ 
    console.log(files)
    if(files.length){
      this.form.controls.image.patchValue(files[0].content); 
    } 
    else{
      this.form.controls.image.patchValue(null); 
    }
  } 

  public onSubmit(){
    console.log(this.form.value);
    if(this.form.valid){
      this.appService.TransferStock(this.form.value).subscribe(stock=>{ 
        if (stock && stock.status == 200 ) {
          this.form.reset();
          this.getStock();
        }
      });
    }else{
      alert('Please Enter correct data');
    }
    
  }  

} 