import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ProductoDto } from '../../../core/models/producto-dto';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductoService } from '../../../core/service/producto.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MensajeAlertaComponent } from '../../../shared/components/mensaje-alerta/mensaje-alerta.component';
import { MensajeInformacionComponent } from '../../../shared/components/mensaje-informacion/mensaje-informacion.component';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ToastNotificationComponent } from '../../../shared/components/toast-notification/toast-notification.component';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-editar-producto',
  standalone: true,
  imports: [MatCardModule, FormsModule, DecimalPipe, CommonModule, ToastNotificationComponent],
  templateUrl: './editar-producto.component.html',
  styleUrl: './editar-producto.component.css'
})
/*
*Este componente esta hecho para realizar la edicion de un producto
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
    cantidad: 0
  }

  //variables que almacenan los cambios en la cantidad
  public cantidadAgregar: number = 0;
  public cantidadDescontar: number = 0;

  // Variables para el estado de la interfaz
  public isLoading: boolean = false;


  constructor(private router: Router,
              private productoService: ProductoService,
              private dialog: MatDialog,
              private toastService: ToastService) { 
              
  }



  ngOnInit(): void {
    this.productoData = this.productoService.getProductoDto();

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
      this.productoData.cantidad += this.cantidadAgregar - this.cantidadDescontar;

      this.enviarSolicitudActualizar();
    }
  }




  /*
  *volver a la pagina anterior
  */
  volver() {
    this.router.navigate(['productos']);
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
          
          // Navegar después de un breve delay para mostrar el mensaje
          setTimeout(() => {
            this.router.navigate(['productos']);
          }, 1500);
        },
        error: error => {
          this.isLoading = false;
          this.toastService.showError('Ocurrió un error en la actualización del producto');
          setTimeout(() => {
            this.router.navigate(['productos']);
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
  *   -las nuevas cantidades deben de ser numeros enteros y mayores a cero
  *   -verificacion de la suma, la  cantidad actual + cantidad a agregar >= cantidad a descontar 
  */
  private validarDatos(): boolean {

    let respuesta: boolean = false;


    if (this.productoData.cantidad + this.cantidadAgregar >= this.cantidadDescontar &&
      (Number.isInteger(this.cantidadDescontar) && Number.isInteger(this.cantidadAgregar)) &&
      this.cantidadAgregar>=0 && this.cantidadDescontar>=0) {

      if (this.productoData.precio > 0) {
        respuesta = true;
      } else {
        this.toastService.showError('El precio debe ser mayor a cero');
      }
    } else {
        this.toastService.showError('Verifique las cantidades que entran o salen');
    }

    return respuesta;
  }




}












