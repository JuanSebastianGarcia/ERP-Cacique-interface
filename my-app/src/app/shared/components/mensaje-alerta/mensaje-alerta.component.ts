import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { CreateDataConfigComponent } from '../../../page/producto/create-data-config/create-data-config.component';

@Component({
  selector: 'app-mensaje-alerta',
  standalone: true,
  imports: [],
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
