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
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-mensaje-informacion',
  standalone: true,
  imports: [MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatIconModule],
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
