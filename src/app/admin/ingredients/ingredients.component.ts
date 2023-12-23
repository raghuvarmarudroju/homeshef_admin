import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator'; 
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table'; 

import { AppService } from 'src/app/app.service';
import { IngredientDialogComponent } from './ingredient-dialog/ingredient-dialog.component';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.scss']
})
export class IngredientsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'description', 'edit', 'remove'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;

  constructor(public appService:AppService, public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.appService.getIngredients().subscribe((ingredients:any) => {
      this.initDataSource(ingredients.data.ingredients); 
    })
  }

  public initDataSource(data:any){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort; 
  } 
 
  public remove(ingredient:any) {
    const index: number = this.dataSource.data.indexOf(ingredient);    
    if (index !== -1) {
      const message = this.appService.getTranslateValue('MESSAGE.SURE_DELETE');
			let dialogRef = this.appService.openConfirmDialog('', message!);
			dialogRef.afterClosed().subscribe(dialogResult => {
				if(dialogResult){ 
          this.appService.deleteIngredient(ingredient).subscribe((ingredient:any) => {
            
          })
          this.dataSource.data.splice(index,1);
          this.initDataSource(this.dataSource.data); 
				}
			});  
    } 
  }  

  public openIngredientDialog(ingredient:any | null){
    const dialogRef = this.appService.openDialog(IngredientDialogComponent, ingredient, 'theme-dialog');
    dialogRef.afterClosed().subscribe(ing => {  
      if(ing){
        let message = '';      
        const index: number = this.dataSource.data.findIndex(x => x.id == ing.id); 
        if(index !== -1){
          this.dataSource.data[index] = ing;
          message = 'ingredient '+ing.name+' updated successfully';
        } 
        else{ 
          let last_ingredient = this.dataSource.data[this.dataSource.data.length - 1]; 
          ing.id = last_ingredient.id + 1; 
          this.dataSource.data.push(ing); 
          this.paginator.lastPage();
          message = 'New ingredient '+ing.name+' added successfully!'; 
        }  
        this.initDataSource(this.dataSource.data); 
        this.snackBar.open(message, '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });          
      }
    });  
  }

}
