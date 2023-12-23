import { Component, OnInit, Inject, NgZone, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Rider, RiderProfile, UserSettings } from '../rider.model';
import { LatLngLiteral, MapsAPILoader } from '@agm/core';
import { AppService } from 'src/app/app.service';
import { matchingPasswords, emailValidator, pincodeValidator, phoneValidator } from 'src/app/theme/utils/app-validators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-rider-dialog',
  templateUrl: './rider-dialog.component.html',
  styleUrls: ['./rider-dialog.component.scss']
})
export class RiderDialogComponent implements OnInit {
  public form:FormGroup;
  public passwordHide:boolean = true;
  public hide = true; 
  title: string = 'AGM project';
  latitude: any;
  longitude: any;
  zoom: any;
  address: any;
  private geoCoder: any;
  @ViewChild('search') searchElementRef?: ElementRef;
  cuisines: any;
  
  constructor(public snackBar: MatSnackBar,public dialogRef: MatDialogRef<RiderDialogComponent>,
              private mapsAPILoader: MapsAPILoader, private ngZone: NgZone,public appService:AppService,
              @Inject(MAT_DIALOG_DATA) public rider: Rider,
              public fb: FormBuilder) {
    this.form = this.fb.group({
      id: null,
      name: [null, Validators.compose([Validators.required, Validators.minLength(5)])],
      number: [null, Validators.compose([Validators.required])],  
      email: [null, Validators.compose([Validators.required])],
      password: null,
      confirmPassword: null,       
      rider: this.fb.group({
        id: 0, 
        user_id : 0, 
        driving_license: [null, Validators.required],
        bike_info: [null, Validators.required],
      }),
      settings: this.fb.group({
        is_active: true,
        is_verified: true,
        registrationDate: null,
        joinedDate: null
      })
    },{validator: matchingPasswords('password', 'confirmPassword')});
    this.form.controls['name'].valueChanges.subscribe(
      (selectedValue) => {
        this.form.get('address.name')?.setValue(selectedValue); 
    });
    this.form.controls['email'].valueChanges.subscribe(
      (selectedValue) => {
        this.form.get('address.email')?.setValue(selectedValue); 
    });
    this.form.controls['number'].valueChanges.subscribe(
      (selectedValue) => {
        this.form.get('address.number')?.setValue(selectedValue); 
    });
    this.getCusines();
  }

  ngOnInit() {
    
    this.mapsAPILoader.load().then(() => {
      
      this.geoCoder = new google.maps.Geocoder;
    });
    console.log(this.rider);
    if(this.rider){
      let cus: any[] = [];
      this.form.patchValue(this.rider);
      this.form.get('settings.is_active')?.setValue(this.rider.is_active);
      this.form.get('settings.is_verified')?.setValue(this.rider.is_verified);
      this.form.get('settings.registrationDate')?.setValue(this.rider.created_at);
    } 
    else{
      this.rider = new Rider();
      this.rider.rider = new RiderProfile();
      this.rider.settings = new UserSettings();
    } 
    console.log(this.rider);
    
  }
  
  public getCusines(){  
    this.appService.getCusines().subscribe((datas: any) => { 
      this.cuisines = datas.data.cuisines;
    }); 
  }
  ngAfterViewInit(): void {
    
    
  }



  close(): void {
    this.dialogRef.close();
  }
  public onRegisterFormSubmit():void {
    console.log(this.form.value);
    console.log(this.form.errors);
    if (this.form.valid) {
      if(this.form.controls.id.value){
        this.appService.updateRider(this.form.value).subscribe((res) => {
          if(res.status==200) {
            this.snackBar.open('Rider has been created successfully!', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
            this.dialogRef.close(res);
          }
        })
      }else{
        this.appService.registerRider(this.form.value).subscribe((res) => {
          if(res.status==200) {
            this.snackBar.open('Rider has been updated successfully!', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
            this.dialogRef.close(res);
          }
        })
      }
    }
  }

}
