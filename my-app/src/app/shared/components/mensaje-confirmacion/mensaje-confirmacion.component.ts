import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-mensaje-confirmacion',
  standalone: true,
  imports: [],
  templateUrl: './mensaje-confirmacion.component.html',
  styleUrl: './mensaje-confirmacion.component.css'
})
/*
*Genera un modal que ofrece al usuario dos opciones para confirmar la operacion o continuar con ella
*/
export class MensajeConfirmacionComponent implements OnInit{

  //variable que almacena la opcion de continuar o no
  public respuesta:boolean=false;

  constructor(
    public dialogRef: MatDialogRef<MensajeConfirmacionComponent>,
    @Inject(MAT_DIALOG_DATA) public message:string,){ 
    }

  ngOnInit(): void {
    this.respuesta=false;
  }

  /*
  *aceptar  y cerrar el modal
  */
  confirmar(){
    this.respuesta=true;
    this.dialogRef.close(this.respuesta);
  };

  /*
  *cancelar y cerrar el modal
  */
  cancelar(){
    
    this.dialogRef.close();
  }
}
