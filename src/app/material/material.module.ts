import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatToolbarModule } from "@angular/material/toolbar"
import { MatIconModule } from "@angular/material/icon"
import { MatButtonModule } from "@angular/material/button"


import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatCardModule } from "@angular/material/card"
import { MatSelectModule } from "@angular/material/select"
import { MatSnackBarModule } from "@angular/material/snack-bar"
import { MatTableModule } from "@angular/material/table"
import { MatExpansionModule } from "@angular/material/expansion"
import { MatPaginatorModule } from "@angular/material/paginator"
import { MatDialogModule } from "@angular/material/dialog"


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    
  ], exports:[
    MatToolbarModule,
    MatIconModule,
    MatButtonModule, 
    MatFormFieldModule,
    MatInputModule, 
    MatCardModule, 
    MatSelectModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatTableModule, 
    MatPaginatorModule,
    MatDialogModule
  ]
})
export class MaterialModule { }
