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
import { CreateDataConfigComponent } from '../../../page/producto/create-data-config/create-data-config.component';

@Component({
  selector: 'app-mensaje-alerta',
  standalone: true,
  imports: [MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose ],
  templateUrl: './mensaje-alerta.component.html',
  styleUrl: './mensaje-alerta.component.css'
})
export class MensajeAlertaComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CreateDataConfigComponent>,
    @Inject(MAT_DIALOG_DATA) public message:string,){ 

    }



    
  ngOnInit(): void {
  }

  /*
  *aceptar el mensaje y cerrar el modal
  */
  confirmar(){
    this.dialogRef.close();
  };



}
