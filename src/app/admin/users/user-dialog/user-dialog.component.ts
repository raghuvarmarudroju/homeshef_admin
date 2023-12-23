import { Component, OnInit, Inject, NgZone, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { User, UserProfile, UserWork, UserContacts, UserSocial, UserSettings, Address } from '../user.model';
import { LatLngLiteral, MapsAPILoader } from '@agm/core';
import { AppService } from 'src/app/app.service';
import { matchingPasswords, emailValidator, pincodeValidator, phoneValidator } from 'src/app/theme/utils/app-validators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent implements OnInit {
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
  communities: any;
  
  constructor(public snackBar: MatSnackBar,public dialogRef: MatDialogRef<UserDialogComponent>,
              private mapsAPILoader: MapsAPILoader, private ngZone: NgZone,public appService:AppService,
              @Inject(MAT_DIALOG_DATA) public user: User,
              public fb: FormBuilder) {
    this.form = this.fb.group({
      id: null,
      community_id: [null, Validators.required],
      name: [null, Validators.compose([Validators.required, Validators.minLength(5)])],
      number: [null, Validators.compose([Validators.required])],  
      email: [null, Validators.compose([Validators.required])],
      gender: null,
      cuisines: null,
      password: [null, Validators.compose([Validators.required, Validators.minLength(6)])],
      confirmPassword: ['', Validators.required],       
      address: this.fb.group({
        id: 0, 
        uid : 0, 
        number: [null, Validators.required],
        avatar: '',
        title:'',
        street:'',
        email: null,
        name: ['', Validators.required],
        address: ['', Validators.required],
        landmark: ['', Validators.required],
        house: ['', Validators.required],
        city: ['', Validators.required],
        lat: '',
        lng: '',
        pincode:''          
      }),
      social: this.fb.group({
        facebook: null,
        twitter: null,
        google: null
      }),
      settings: this.fb.group({
        isActive: true,
        isVerified: true,
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
    this.getCommunities();
  }

  ngOnInit() {
    
    this.mapsAPILoader.load().then(() => {
      
      this.geoCoder = new google.maps.Geocoder;
    });
    console.log(this.user);
    if(this.user){
      let cus: any[] = [];
      this.form.patchValue(this.user);
      this.user.cuisines.forEach((info:any) => {
        cus.push(info.cuisine_id);
      });
      console.log(cus);
      this.form.patchValue({cuisines: cus});
      this.form.get('address.uid')?.setValue(this.user.address.user_id)
      //this.form.controls.cuisines.setValue(cus);
    } 
    else{
      this.user = new User();
      this.user.profile = new UserProfile();
      this.user.address = new Address();
      this.user.cuisines = []
      this.user.contacts = new UserContacts();
      this.user.social = new UserSocial();
      this.user.settings = new UserSettings();
    } 
    console.log(this.user);
    this.setCurrentLocation();
  }
  
  public getCusines(){  
    this.appService.getCusines().subscribe((datas: any) => { 
      this.cuisines = datas.data.cuisines;
    }); 
  }
  public getCommunities(){
    this.appService.getCommunities().subscribe((community:any)=>{
      this.communities = community.communities;
    })
  }
  ngAfterViewInit(): void {
    
    this.findAdress();
  }

  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      
        
        navigator.geolocation.getCurrentPosition((position) => {
          if(this.user == null || this.user.address.lat){
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
          }else{
            this.latitude = this.user.address.lat==''?position.coords.latitude:parseFloat(this.user.address.lat);
            this.longitude = this.user.address.lng==''?position.coords.longitude:parseFloat(this.user.address.lng);
          }
          
          this.zoom = 10;
          this.getAddress(this.latitude, this.longitude);
        });
      
    }
  }

  getAddress(latitude:any, longitude:any) {
    console.log('lat is: ');
    console.log(latitude);
    console.log('lon is: ');
    console.log(longitude);
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results:any, status:any) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          console.log('geo result is: ');
          console.log(results[0]);
          this.address = results[0].formatted_address;
          this.form.get('address.address')?.setValue(this.address);
          this.form.get('address.lat')?.setValue(latitude);
          this.form.get('address.lng')?.setValue(longitude);
          for (var i = 0; i < results[0].address_components.length; i++) {       
            for (var j = 0; j < results[0].address_components[i].types.length; j++) {
              if (results[0].address_components[i].types[j] === "postal_code") {
                this.form.get('address.pincode')?.setValue(results[0].address_components[i].long_name);
              }
              if (results[0].address_components[i].types[j] === "locality") {
                this.form.get('address.city')?.setValue(results[0].address_components[i].long_name);
              }
            }
          }
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    
    });
  }

  public centerChanged(coords: LatLngLiteral) {
    console.log(coords.lat);
    console.log(coords.lng);
  }

  public mapReady(map:any) {
    map.addListener("dragend", () => {
      // do something with centerLatitude/centerLongitude
      console.log('map is ready');
    });
  }

  markerDragEnd($event: any) {
    console.log($event);
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.getAddress(this.latitude, this.longitude);
  }
  public findAdress(){
    this.mapsAPILoader.load().then(() => {
        let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef?.nativeElement);
        autocomplete.addListener("place_changed", () => {
           this.ngZone.run(() => {
             // some details
             let place: google.maps.places.PlaceResult = autocomplete.getPlace();
             //this.address = place.formatted_address;
             
             //this.web_site = place.website;
             //this.name = place.name;
             //this.zip_code = place.address_components[place.address_components.length - 1].long_name;
             //set latitude, longitude and zoom
             console.log(place.geometry?.location.lat());
             console.log(place.geometry?.location.lng());
             this.latitude = place.geometry?.location.lat();
             this.longitude = place.geometry?.location.lng();
             this.getAddress(place.geometry?.location.lat(), place.geometry?.location.lng());
             //this.zoom = 12;
           });
        });
    });
  }
  close(): void {
    this.dialogRef.close();
  }
  public onRegisterFormSubmit():void {
    console.log(this.form.value);
    console.log(this.form.errors);
    if (this.form.valid) {
      if(this.form.controls.id.value){
        this.appService.updateChef(this.form.value).subscribe((res) => {
          if(res.status==200) {
            //this.form.get('address.uid')?.setValue(res.data.user.id);
            this.appService.editAddress(this.form.get('address')?.value).subscribe((res) => {
              if(res.status==200) {
                this.snackBar.open('Address has been saved successfully!', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
                this.dialogRef.close(res);
              }
            })
          }
        })
      }else{
        this.appService.registerChef(this.form.value).subscribe((res) => {
          if(res.status==200) {
            this.form.get('address.uid')?.setValue(res.data.user.id);
            this.appService.addAddress(this.form.get('address')?.value).subscribe((res) => {
              if(res.status==200) {
                this.snackBar.open('Address has been saved successfully!', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
                this.dialogRef.close(res);
              }
            })
          }
        })
      }
    }
  }

}
