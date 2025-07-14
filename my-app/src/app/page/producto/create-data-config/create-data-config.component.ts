import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfigurationTypesService } from '../../../core/service/configuration-types.service';
import { Observable } from 'rxjs';
import { RespuestaDto } from '../../../core/models/respuesta-dto';
import { MensajeInformacionComponent } from '../../../shared/components/mensaje-informacion/mensaje-informacion.component';


@Component({
  selector: 'app-create-data-config',
  standalone: true,
  imports: [MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    CommonModule],
  templateUrl: './create-data-config.component.html',
  styleUrl: './create-data-config.component.css'
})

/*
*Este componente facilita la creacion de los datos al abrir un modal para ingresar el nuevo nombre y registrarlo
*/
export class CreateDataConfigComponent implements OnInit {



  public opcion:string='';
  public respuesta:string='';

  constructor(
    public dialogRef: MatDialogRef<CreateDataConfigComponent>,
    public dialog: MatDialog,
    private configurationTypesSerice: ConfigurationTypesService,
    @Inject(MAT_DIALOG_DATA) public data: { mensaje: string; tipoDato: string }
  ) {
    }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  // Métodos para obtener configuración dinámica basada en el message
  getDataType(): string {
    const msg = this.data.mensaje?.toLowerCase() || '';
    if (msg.includes('institucion')) return 'instituciones';
    if (msg.includes('prenda')) return 'prendas';
    if (msg.includes('horario')) return 'horarios';
    if (msg.includes('genero')) return 'generos';
    if (msg.includes('talla')) return 'tallas';
    return 'general';
  }

  getIcon(): string {
    const type = this.getDataType();
    const icons: {[key: string]: string} = {
      'instituciones': '🏢',
      'prendas': '👔',
      'horarios': '⏰',
      'generos': '👥',
      'tallas': '📏',
      'general': '➕'
    };
    return icons[type] || '➕';
  }

  getTitle(): string {
    const type = this.getDataType();
    const titles: {[key: string]: string} = {
      'instituciones': 'Que institución desea agregar',
      'prendas': 'Que prenda desea agregar',
      'horarios': 'Que horario desea agregar',
      'generos': 'Que género desea agregar',
      'tallas': 'Que talla desea agregar',
      'general': 'Agregar nuevo dato'
    };
    return titles[type] || this.data.mensaje || 'Agregar nuevo dato';
  }

  getSubtitle(): string {
    const type = this.getDataType();
    const subtitles: {[key: string]: string} = {
      'instituciones': 'Agregar nombre de la institución',
      'prendas': 'Agregar nombre de la prenda',
      'horarios': 'Agregar nombre del horario',
      'generos': 'Agregar nombre del género',
      'tallas': 'Agregar nombre de la talla',
      'general': 'Agregar nombre del dato'
    };
    return subtitles[type] || 'Agregar nombre del dato';
  }

  getPlaceholder(): string {
    const type = this.getDataType();
    const placeholders: {[key: string]: string} = {
      'instituciones': 'Ej: Universidad Nacional',
      'prendas': 'Ej: Camisa, Pantalón, Chaqueta',
      'horarios': 'Ej: Mañana, Tarde, Noche',
      'generos': 'Ej: Masculino, Femenino, Unisex',
      'tallas': 'Ej: XS, S, M, L, XL',
      'general': 'Ingrese el nombre'
    };
    return placeholders[type] || 'Ingrese el nombre';
  }

  getHeaderStyle(): any {
    const type = this.getDataType();
    const gradients: {[key: string]: string} = {
      'instituciones': 'linear-gradient(135deg, #3498db, #2980b9)',
      'prendas': 'linear-gradient(135deg, #e74c3c, #c0392b)',
      'horarios': 'linear-gradient(135deg, #f39c12, #e67e22)',
      'generos': 'linear-gradient(135deg, #9b59b6, #8e44ad)',
      'tallas': 'linear-gradient(135deg, #1abc9c, #16a085)',
      'general': 'linear-gradient(135deg, #27ae60, #2ecc71)'
    };
    return {
      'background': gradients[type] || gradients['general'],
      'color': 'white'
    };
  }

  getAddButtonStyle(): any {
    const type = this.getDataType();
    const gradients: {[key: string]: string} = {
      'instituciones': 'linear-gradient(135deg, #3498db, #2980b9)',
      'prendas': 'linear-gradient(135deg, #e74c3c, #c0392b)',
      'horarios': 'linear-gradient(135deg, #f39c12, #e67e22)',
      'generos': 'linear-gradient(135deg, #9b59b6, #8e44ad)',
      'tallas': 'linear-gradient(135deg, #1abc9c, #16a085)',
      'general': 'linear-gradient(135deg, #27ae60, #2ecc71)'
    };
    
    return {
      'background': this.respuesta?.trim() ? gradients[type] || gradients['general'] : '#bdc3c7',
      'box-shadow': this.respuesta?.trim() ? '0 5px 20px rgba(52, 152, 219, 0.3)' : 'none'
    };
    
  }


    /*
  * se encarga de abrir el modal que solitica el nombre del nuevo dato y luego pasarselo al proceso de crear
  */
  public agregarDato() {

    if (this.respuesta == '') {
            alert('No se puede agregar un dato vacio');
            this.dialogRef.close();
          }
    else {
      this.agregarDatoSolicitud(this.respuesta);
      
    }
  }


    /*
    *hace la solicitud al servicio para crear un dato usando la respuesta del modal de agregar dato.
    *se usa la variable de tipo actual para saber en cual tabla se va a hacer el insert
    *@ param respuesta - nombre del dato a agregarse
    */
  private agregarDatoSolicitud(respuesta: string) {
    let solicitud$: Observable<RespuestaDto<string>>;

    switch (this.data.tipoDato) {
      case 'institucion':
        solicitud$ = this.configurationTypesSerice.agregarInstitucion(respuesta);
        break;
      case 'horario':
        solicitud$ = this.configurationTypesSerice.agregarhorario(respuesta);
        break;
      case 'talla':
        solicitud$ = this.configurationTypesSerice.agregartalla(respuesta);
        break;
      case 'prenda':
        solicitud$ = this.configurationTypesSerice.agregarprenda(respuesta);
        break;
      case 'genero':
        solicitud$ = this.configurationTypesSerice.agregarGenero(respuesta);
        break;
      default:
        console.error('Tipo dato desconocido');
        return;
    }
  
    solicitud$.subscribe({
      next: data => {
        this.dialogRef.close({
          error: false,
          mensaje: data.respuesta
        });
      },
      error: error => {
        this.dialogRef.close({
          error: true,
          mensaje: error.error.respuesta
        });
      }
    });
    }


      /*
    *se encarga de imprimir el mensaje que indica la respuesta del back
    */
    private imprimirMensaje(respuesta: Observable<RespuestaDto<string>>) {
      respuesta.subscribe({
        next: data => {
          const dialogRef = this.dialog.open(MensajeInformacionComponent, { data: data.respuesta });
        },
        error: error => {
          const dialogRef = this.dialog.open(MensajeInformacionComponent, { data: 'Ocurrio un error' });
        }
      });
    }

}
