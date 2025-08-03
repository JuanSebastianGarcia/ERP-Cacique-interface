import { Component, OnInit, Inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ProductoDto } from '../../../core/models/producto-dto';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../../../core/service/producto.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MensajeAlertaComponent } from '../../../shared/components/mensaje-alerta/mensaje-alerta.component';
import { MensajeInformacionComponent } from '../../../shared/components/mensaje-informacion/mensaje-informacion.component';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ToastNotificationComponent } from '../../../shared/components/toast-notification/toast-notification.component';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-editar-producto-dialog',
  standalone: true,
  imports: [MatCardModule, FormsModule, DecimalPipe, CommonModule, ToastNotificationComponent],
  templateUrl: './editar-producto.component.html',
  styleUrl: './editar-producto.component.css'
})
/*
*Este componente está hecho para realizar la edición de un producto como dialog modal
*/
export class EditarProductoComponent implements OnInit {

  //variables que se mostraran en el html para representar los datos del producto en edicion
  public id: number = 0;
  public prenda: string = "prenda";
  public cantidad: number = 0;
  public institucion: string = "institucion";
  public talla: string = "talla";
  public horario: string = "horario";
  public precio: number = 0;
  public genero: string = " genero";

  /*
  *almacena los datos del producto que se va a actualizar
  */
  productoData: ProductoDto = {
    id: 0,
    prenda: '',
    institucion: '',
    talla: '',
    horario: '',
    genero: '',
    precio: 0,
    cantidad: 0,
    descripcion: ''
  }

  //variables que almacenan los cambios en la cantidad
  public cantidadAgregar: number = 0;
  public cantidadDescontar: number = 0;

  // Variables para el estado de la interfaz
  public isLoading: boolean = false;

  // Variable para ajuste de cantidad (como en el modal del ejemplo)
  public cantidadAjuste: number = 0;


  constructor(
    public dialogRef: MatDialogRef<EditarProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProductoDto,
    private productoService: ProductoService,
    private dialog: MatDialog,
    private toastService: ToastService
  ) { 
    this.productoData = { ...data }; // Crear copia del producto
  }

  ngOnInit(): void {
    //invocacion
    this.cargarDatos();
  }



  /*
  *guardar producto
  *Este metodo se encarga de almacenar los nuevos datos, validando que la cantidad no sea incongruente
  *y asignando los nuevos datos
  */
  actualizarProducto() {
    if (this.isLoading) return;

    let datosValidados: boolean = this.validarDatos();

    //se validan las restas
    if (datosValidados) {
      this.isLoading = true;
      this.productoData.cantidad = this.getStockFinal();

      this.enviarSolicitudActualizar();
    }
  }




  /*
  *cerrar el dialog
  */
  cerrarDialog() {
    this.dialogRef.close({ success: false });
  }

  /*
  * Ajustar cantidad con controles + y - (nuevo método del modal)
  */
  public ajustarCantidad(cambio: number) {
    this.cantidadAjuste += cambio;
    const stockFinal = this.productoData.cantidad + this.cantidadAjuste;
    
    // Prevenir stock negativo
    if (stockFinal < 0) {
      this.cantidadAjuste = -this.productoData.cantidad;
    }
  }

  /*
  * Obtener el stock final calculado
  */
  public getStockFinal(): number {
    return this.productoData.cantidad + this.cantidadAjuste;
  }


  /*
  * hace una solicitud de actualizacion del producto
  */
  private enviarSolicitudActualizar() {
    this.productoService.actualizarProducto(this.productoData).subscribe(
      {
        next: data => {
          this.isLoading = false;
          this.toastService.showSuccess('¡Producto actualizado exitosamente!');
          
          // Cerrar el dialog y devolver el producto actualizado
          setTimeout(() => {
            this.dialogRef.close({
              success: true,
              producto: this.productoData
            });
          }, 1500);
        },
        error: error => {
          this.isLoading = false;
          this.toastService.showError('Ocurrió un error en la actualización del producto');
          setTimeout(() => {
            this.dialogRef.close({
              success: false,
              error: error
            });
          }, 2000);
        }
      }
    );
  }


  /*
  *se encarga de asignar los datos a las variables que son leidas por el hmtl
  */
  private cargarDatos() {
    this.id = this.productoData.id;
    this.prenda = this.productoData.prenda;
    this.cantidad = this.productoData.cantidad;
    this.institucion = this.productoData.institucion;
    this.talla = this.productoData.talla;
    this.horario = this.productoData.horario;
    this.precio = this.productoData.precio;
    this.genero = this.productoData.genero;
  }



  /*
  *validar la integridad y coherencia de los datos ingresados
  *validaciones:
  *   -el precio nuevo sea mayor a cero
  *   -el stock final no sea negativo
  */
  private validarDatos(): boolean {
    let respuesta: boolean = false;

    const stockFinal = this.getStockFinal();

    if (stockFinal >= 0) {
      if (this.productoData.precio > 0) {
        respuesta = true;
      } else {
        this.toastService.showError('El precio debe ser mayor a cero');
      }
    } else {
      this.toastService.showError('La cantidad final no puede ser negativa');
    }

    return respuesta;
  }




}












