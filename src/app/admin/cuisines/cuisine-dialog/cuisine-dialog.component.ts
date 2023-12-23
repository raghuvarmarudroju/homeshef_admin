import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-cuisine-dialog',
  templateUrl: './cuisine-dialog.component.html',
  styleUrls: ['./cuisine-dialog.component.scss']
})
export class CuisineDialogComponent implements OnInit {
  public form!: FormGroup;
  fileTouched: boolean = false;
  constructor(public appService:AppService,public dialogRef: MatDialogRef<CuisineDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public cuisine: any,
              public fb: FormBuilder) { }

  ngOnInit(): void { 
    this.form = this.fb.group({
      id: 0,
      icon:'',
      type:'',
      name: [null, Validators.required],
      description: null ,
      fileTouched:null
    }); 
    console.log(this.cuisine);
    if(this.cuisine){
      this.form.patchValue(this.cuisine);
      console.log(this.appService.mediaURL +''+this.cuisine.icon);
      this.form.patchValue({icon: this.appService.mediaURL +''+this.cuisine.icon});
    };
  }
  public fileChange(files:any){ 
    this.fileTouched = true;
    this.form.patchValue({fileTouched: this.fileTouched});
    if(files.length){
      this.form.controls.icon.patchValue(files[0].content);
      this.form.controls.type.patchValue(files[0].name.split('.').pop()); 
    } 
    else{
      this.form.controls.avatar.patchValue(''); 
    }
  }
  public onSubmit(){ 
    if(this.form.valid){
      if(this.form.value.id == 0){
        this.appService.saveCuisine(this.form.value).subscribe((cuisine:any) => {
          this.dialogRef.close(this.form.value);
        })
      }else{
        if(!this.fileTouched){
          this.form.patchValue({icon: this.cuisine.icon});
        }
        this.appService.updateCuisine(this.form.value).subscribe((cuisine:any) => {
          this.dialogRef.close(this.form.value);
        })
      }
    }
  }

}
