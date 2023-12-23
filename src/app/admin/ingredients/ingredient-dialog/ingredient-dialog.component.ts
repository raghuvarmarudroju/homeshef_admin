import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-ingredient-dialog',
  templateUrl: './ingredient-dialog.component.html',
  styleUrls: ['./ingredient-dialog.component.scss']
})
export class IngredientDialogComponent implements OnInit {
  public form!: FormGroup;
  constructor(public appService:AppService,public dialogRef: MatDialogRef<IngredientDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public ingredient: any,
              public fb: FormBuilder) { }

  ngOnInit(): void { 
    this.form = this.fb.group({
      id: 0,
      name: [null, Validators.required],
      description: null 
    }); 
    console.log(this.ingredient);
    if(this.ingredient){
      this.form.patchValue(this.ingredient); 
    };
  }

  public onSubmit(){ 
    if(this.form.valid){
      if(this.form.value.id == 0){
        this.appService.saveIngredient(this.form.value).subscribe((ingredient:any) => {
          this.dialogRef.close(this.form.value);
        })
      }else{
        this.appService.updateIngredient(this.form.value).subscribe((ingredient:any) => {
          this.dialogRef.close(this.form.value);
        })
      }
    }
  }

}
