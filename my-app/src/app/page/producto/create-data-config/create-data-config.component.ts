import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';



@Component({
  selector: 'app-create-data-config',
  standalone: true,
  imports: [    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,],
  templateUrl: './create-data-config.component.html',
  styleUrl: './create-data-config.component.css'
})
export class CreateDataConfigComponent implements OnInit {


  public opcion:string='';
  public respuesta:string='';

  constructor(
    public dialogRef: MatDialogRef<CreateDataConfigComponent>,
    @Inject(MAT_DIALOG_DATA) public message:string,) {}



  ngOnInit(): void {
  }




  onNoClick(): void {
    this.dialogRef.close();
  }

  
}
