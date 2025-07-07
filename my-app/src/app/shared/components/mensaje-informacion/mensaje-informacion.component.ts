import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-mensaje-informacion',
  standalone: true,
  imports: [],
  templateUrl: './mensaje-informacion.component.html',
  styleUrl: './mensaje-informacion.component.css'
})
/*
*Genera un modal que muestra un mensaje de informacion al usuario 
*/
export class MensajeInformacionComponent implements OnInit{

  constructor(
    private dialogRef:MatDialogRef<MensajeInformacionComponent>,
    @Inject(MAT_DIALOG_DATA) public message:string){

  }

  /*
  *
  */
  ngOnInit(): void {

  }

  /*
  *Cierra el modal despues de aceptar
  */
  confirmar() {
    this.dialogRef.close();
  }

}
