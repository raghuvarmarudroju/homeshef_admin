import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { AppService } from 'src/app/app.service';
import { MenuItem } from 'src/app/app.models';
import { ActivatedRoute } from '@angular/router';
import { formatDate, isPlatformBrowser } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  public form!: FormGroup;
  public formDemo!: FormGroup;
  private sub: any;
  public id:any;
  public showImage:boolean = false;
  public wpflMarginPercent = 15;
  public wpflMarginValue:any;
  public gstPercent = 18;
  public gstValue:any;
  public tdsPercent = 1;
  public tdsValue:any;
  public chefEarnings:any;
  public foodTags: Array<any> = [];
  public foodTypes: Array<any> = [];
  public ingredients: Array<any> = [];
  public units: Array<any> = [];
  public minDate = new Date();
  public maxDate = new Date(); 
  public dates: any = {
    startDate: new Date(Date.now()),
    endDate: new Date(Date.now())
  }
  public weekDays:any = [
    {"k":"Su","v":"sun","selected":true,"id":1},
    {"k":"Mo","v":"mon","selected":true,"id":2},
    {"k":"Tu","v":"tue","selected":true,"id":3},
    {"k":"We","v":"wed","selected":true,"id":4},
    {"k":"Th","v":"thu","selected":true,"id":5},
    {"k":"Fr","v":"fri","selected":true,"id":6},
    {"k":"Sa","v":"sat","selected":true,"id":7},
  ];

  public availabilityFlags: any[] = [
    {value: 0, name: 'Not Limited'},
    {value: 1, name: 'Available On'},
    {value: 2, name: 'Unavailable On'},
    {value: 3, name: 'Available During'},
    {value: 4, name: 'Unavailable During'}
  ];

  constructor(public appService:AppService, public snackBar: MatSnackBar,
              public formBuilder: FormBuilder, 
              private activatedRoute: ActivatedRoute,
              @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {  
    this.form = this.formBuilder.group({ 
      "id": 0,
      "name": [null, Validators.compose([Validators.required, Validators.minLength(4)])],
      "description": null,
      "price": [null, Validators.required ], 
      "image": null, 
      "discount": null, 
      "availibilityCount": null, 
      "weight": null,
      "isVegetarian": false,
      "categoryId": [null, Validators.required ]   
    });

    this.initializeForm();
    

    console.log(this.formDemo);
   

    this.getCategories();
    this.getFoodTags();
    this.getFoodTypes();
    this.getIngredients();
    this.getShefs();
    this.observePrice();
    this.getUnits();
    
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

  public initializeForm() {
    this.formDemo = this.formBuilder.group({
      "chef_id": this.appService.UserData.profile.id,
      "name": ['', Validators.required],
      "description": "",
      "image": null,
      "dayNames": this.formBuilder.array([new FormControl('sun'),new FormControl('mon'),new FormControl('tue'),new FormControl('wed'),new FormControl('thu'),new FormControl('fri'),new FormControl('sat')]),
      "availability": 0,
      "startDate": [formatDate(this.dates.startDate, 'yyyy-MM-dd', 'en'), [Validators.required]],
      "endDate": [formatDate(this.dates.endDate, 'yyyy-MM-dd', 'en'), [Validators.required]],
      "perDayItemCookedCount": 0,
      "price": 0,
      "types": 4,
      "unit": ['', Validators.required],
      "size": [0, Validators.required],
      "expiresIn": [0, Validators.required],
      "ingredients": this.formBuilder.array([]),
      "spiceLevel": "Not Spicy",
      "reheatingInstructions": "",
      "tags": this.formBuilder.array([]),
      "comment": "",
      "chefearnings":0,
      "wpflMarginPercent":0,
      "wpflMarginValue":0,
      "gstPercent":0,
      "gstValue":0,
      "tdsPercent":0,
      "tdsValue":0
    });
  }
  

  ngOnDestroy() {
    this.sub.unsubscribe();
  } 

  public observePrice() {
    this.formDemo.get("price")?.valueChanges.subscribe((selectedValue:any) => {
      console.log(selectedValue);
      this.wpflMarginValue = (this.wpflMarginPercent/100)*selectedValue;
      this.chefEarnings = selectedValue - this.wpflMarginValue;
      this.gstValue = (this.gstPercent/100) * this.wpflMarginValue;
      this.chefEarnings = this.chefEarnings - this.gstValue;
      this.tdsValue = (this.tdsPercent/100) * this.chefEarnings;
      this.chefEarnings = this.chefEarnings - this.tdsValue;
    })
  }

  public getCategories(){
    if(!this.appService.Data.categories.length){
      this.appService.getCategories().subscribe(categories=>{ 
        this.appService.Data.categories = categories;
      });
    } 
  }
  
  public getShefs() {
    this.appService.getShefs().subscribe((res) => {
      console.log(res);
    });
  }

  public getFoodTags() {
    this.appService.getFoodTags().subscribe((res) => {
      this.foodTags = res.data.food_tags;
    });
  }

  public getIngredients() {
    this.appService.getIngredients().subscribe((res : any) => {
      this.ingredients = res.data.ingredients;
    });
  }

  public getUnits() {
    this.appService.getUnits().subscribe((res) => {
      this.units = res.data.size_units;
    });
  }

  public getFoodTypes() {
    this.appService.getFoodTypes().subscribe((res) => {
      this.foodTypes = res.data.food_types;
    });
  }

  public handleTags(e: any) {
    console.log(e.checked);
    console.log(e.source.value);
    let tagarr = this.formDemo.get('tags') as FormArray;
    if(e.checked){
      tagarr.push(new FormControl(e.source.value));
    }
    else {
      let i = 0;
      tagarr.controls.forEach((t: any) => {
        if(t.value == e.source.value) {
          tagarr.removeAt(i);
          return;
        }
        i++;
      });
    }
    console.log(this.formDemo.get('tags')?.value);
  }

  public handleIngredients(e: any) {
    console.log(e);
    let ingredientarr = this.formDemo.get('ingredients') as FormArray;
    ingredientarr.clear();
    if(e.value.length) {
      e.value.forEach((t: any) => {
        ingredientarr.push(new FormControl(t));
      });
    }
    console.log(this.formDemo.get('ingredients')?.value);
  }

  

  public alterWeekDaysSelection(index:number, e:any) {
    this.weekDays[index].selected = !this.weekDays[index].selected;
    console.log(e.checked);
    console.log(e.source.value);
    let dayarr = this.formDemo.get('dayNames') as FormArray;
    if(e.checked){
      dayarr.push(new FormControl(e.source.value));
    }
    else {
      let i = 0;
      dayarr.controls.forEach((t: any) => {
        if(t.value == e.source.value) {
          dayarr.removeAt(i);
          return;
        }
        i++;
      });
    }
    console.log(this.formDemo.get('dayNames')?.value);
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
      this.formDemo.controls.image.patchValue(files[0].content); 
    } 
    else{
      this.formDemo.controls.image.patchValue(null); 
    }
  } 

  public dateFilter: (date: Date | null) => boolean =
  (date: Date | null) => {
    if (!date) {
      return false;
    }
    const day = date.getDay();
    let obj:any = {sun:0, mon:1, tue:2, wed:3, thu:4, fri:5, sat:6};
    let mainArr: any[] = [];
    this.formDemo.get('dayNames')?.value.forEach((i: any) => mainArr.push(obj[i]));
    return mainArr.includes(day);
    //return day == 1 || day == 2; // 1 means monday, 0 means sunday, etc.
  };

  public onSubmit(){
    console.log(this.form.value);
  }  

  public onDemoSubmit() {
    console.log(this.formDemo.value);
    if(this.formDemo.valid){
      this.formDemo.value.startDate = formatDate(this.formDemo.get('startDate')?.value, 'yyyy-MM-dd', 'en');
      this.formDemo.value.endDate = formatDate(this.formDemo.get('endDate')?.value, 'yyyy-MM-dd', 'en');
      this.formDemo.value.chefearnings = this.chefEarnings;
      this.formDemo.value.wpflMarginPercent = this.wpflMarginPercent;
      this.formDemo.value.wpflMarginValue = this.wpflMarginValue;
      this.formDemo.value.gstPercent = this.gstPercent;
      this.formDemo.value.gstValue = this.gstValue;
      this.formDemo.value.tdsPercent = this.tdsPercent;
      this.formDemo.value.tdsValue = this.tdsValue;
      console.log(this.formDemo);
      if(!this.formDemo.value.image) {
        this.snackBar.open('Please upload the item image!', '×', { panelClass: 'danger', verticalPosition: 'top', duration: 3000 });
      }else {
        this.appService.saveChefItem(this.formDemo.value).subscribe((res)=>{
          this.snackBar.open('Menu item is added successfully!', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
        });
      }
    }
  }

} 