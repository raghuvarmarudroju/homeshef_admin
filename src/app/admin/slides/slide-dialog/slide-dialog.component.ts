import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-slide-dialog',
  templateUrl: './slide-dialog.component.html',
  styleUrls: ['./slide-dialog.component.scss']
})
export class SlideDialogComponent implements OnInit {
  public form!: FormGroup;
  mobileFileTouched: boolean = false;
  desktopFileTouched: boolean = false;
  constructor(public appService:AppService,public dialogRef: MatDialogRef<SlideDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public slide: any,
              public fb: FormBuilder) { }

  ngOnInit(): void { 
    this.form = this.fb.group({
      id: 0,
      mobile_image:'',
      desktop_image:'',
      status:1,
      heading1: [null, Validators.required],
      heading2: null ,
      mobileFileTouched:null,
      desktopFileTouched:null
    }); 
    console.log(this.slide);
    if(this.slide){
      this.form.patchValue(this.slide);
      console.log(this.appService.mediaURL +''+this.slide.mobile_image);
      this.form.patchValue({mobile_image: this.appService.mediaURL +''+this.slide.mobile_image});
      this.form.patchValue({desktop_image: this.appService.mediaURL +''+this.slide.desktop_image});
    };
  }
  public fileChange(files:any,type : any){ 
    if(type ==1){
      this.mobileFileTouched = true;
      this.form.patchValue({mobileFileTouched: this.mobileFileTouched});
      if(files.length){
        this.form.controls.mobile_image.patchValue(files[0].content);
        //this.form.controls.type.patchValue(files[0].name.split('.').pop()); 
      } 
      else{
        this.form.controls.mobile_image.patchValue(''); 
      }
    }else if(type == 2){
      this.desktopFileTouched = true;
      this.form.patchValue({desktopFileTouched: this.desktopFileTouched});
      if(files.length){
        this.form.controls.desktop_image.patchValue(files[0].content);
        //this.form.controls.type.patchValue(files[0].name.split('.').pop()); 
      } 
      else{
        this.form.controls.mobile_image.patchValue(''); 
      }
    }
    
  }
  public onSubmit(){ 
    if(this.form.valid){
      if(this.form.value.id == 0){
        this.appService.saveBanner(this.form.value).subscribe((slide:any) => {
          this.dialogRef.close(this.form.value);
        })
      }else{
        if(!this.mobileFileTouched){
          this.form.patchValue({mobile_image: this.slide.mobile_image});
        }
        if(!this.desktopFileTouched){
          this.form.patchValue({desktop_image: this.slide.desktop_image});
        }
        this.appService.updateBanner(this.form.value).subscribe((slide:any) => {
          this.dialogRef.close(this.form.value);
        })
      }
    }
  }

}
