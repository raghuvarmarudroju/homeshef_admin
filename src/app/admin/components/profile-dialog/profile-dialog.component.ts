import { Component, ElementRef, Inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LatLngLiteral, MapsAPILoader } from '@agm/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.scss']
})
export class ProfileDialogComponent implements OnInit {

  title: string = 'AGM project';
  latitude: any;
  longitude: any;
  zoom: any;
  address: any;
  public fileTouched:boolean = false;
  private geoCoder: any;
  @ViewChild('search') searchElementRef?: ElementRef;
  public form!: FormGroup;
  constructor(public dialogRef: MatDialogRef<ProfileDialogComponent>, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone,
              @Inject(MAT_DIALOG_DATA) public data: any, public snackBar: MatSnackBar,
              public fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: 0, 
      number: ['', Validators.required],
      avatar: '',
      type:null,
      email: null,
      name: ['', Validators.required],
      address: ['', Validators.required],
      landmark: ['', Validators.required],
      house: ['', Validators.required],
      city: ['', Validators.required],
      lat: '',
      lng: '',
      pincode: '',
      fileTouched:null
      /*
      address: this.fb.group({ 
        city: ['', Validators.required],
        zip: ['', Validators.required],
        address: ['', Validators.required]
      }) 
      */
    }); 

    if(this.data){
      this.form.patchValue({fileTouched: this.fileTouched});
      this.form.patchValue(this.data);
      console.log(this.form);
    };

    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;
    });
  }

  ngAfterViewInit(): void {
    this.findAdress();
  }

  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      
        
        navigator.geolocation.getCurrentPosition((position) => {
          this.latitude = this.data.lat==''?position.coords.latitude:parseFloat(this.data.lat);
          this.longitude = this.data.lng==''?position.coords.longitude:parseFloat(this.data.lng);
          this.zoom = 8;
          this.getAddress(this.latitude, this.longitude);
        });
      
    }
  }

  getAddress(latitude:any, longitude:any) {
    this.form.patchValue({pincode: ''});
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

          results[0].address_components.forEach((item: any) => {
            if(item.types.includes('postal_code')) {
              this.form.patchValue({pincode: item.long_name});
            }
            return;
          });

          this.form.patchValue({address: this.address});
          this.form.patchValue({lat: latitude});
          this.form.patchValue({lng: longitude});

          for (var i = 0; i < results[0].address_components.length; i++) {       
            for (var j = 0; j < results[0].address_components[i].types.length; j++) {
              if (results[0].address_components[i].types[j] === "postal_code") {
                this.form.patchValue({pincode : results[0].address_components[i].long_name});
              }
              if (results[0].address_components[i].types[j] === "locality") {
                this.form.patchValue({city : results[0].address_components[i].long_name});
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

  public onSubmit(){ 
    console.log('pincode is: ');
    console.log(this.form.value.pincode);
    if(this.form.valid){
      if(!this.form.value.pincode) {
        this.snackBar.open('The location has no pincode associated! Please move the marker a little bit and submit again', '×', { panelClass: 'danger', verticalPosition: 'top', duration: 3000 });
      }
      else {
        this.dialogRef.close(this.form.value);
      }
    }
  }

  public compareFunction(o1: any, o2: any) {
    return (o1.name == o2.name && o1.code == o2.code);
  }

  public fileChange(files:any){ 
    this.fileTouched = true;
    this.form.patchValue({fileTouched: this.fileTouched});
    if(files.length){
      this.form.controls.avatar.patchValue(files[0].content);
      this.form.controls.type.patchValue(files[0].name.split('.').pop()); 
    } 
    else{
      this.form.controls.avatar.patchValue(''); 
    }
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

}
