import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Category } from 'src/app/app.models';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.scss']
})
export class CategoryDialogComponent implements OnInit {
  public form!: FormGroup;
  constructor(public appService:AppService,public dialogRef: MatDialogRef<CategoryDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public category: any,
              public fb: FormBuilder) { }

  ngOnInit(): void { 
    this.form = this.fb.group({
      id: 0,
      name: [null, Validators.required],
      description: null 
    }); 
    console.log(this.category);
    if(this.category){
      this.form.patchValue(this.category); 
    };
  }

  public onSubmit(){ 
    if(this.form.valid){
      if(this.form.value.id == 0){
        this.appService.saveFoodType(this.form.value).subscribe((category:any) => {
          this.dialogRef.close(this.form.value);
        })
      }else{
        this.appService.updateFoodType(this.form.value).subscribe((category:any) => {
          this.dialogRef.close(this.form.value);
        })
      }
    }
  }

}
