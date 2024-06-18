import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ProductoDto } from '../../../core/models/producto-dto';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductoService } from '../../../core/service/producto.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MensajeAlertaComponent } from '../../../shared/components/mensaje-alerta/mensaje-alerta.component';
import { MensajeInformacionComponent } from '../../../shared/components/mensaje-informacion/mensaje-informacion.component';

@Component({
  selector: 'app-editar-producto',
  standalone: true,
  imports: [MatCardModule, FormsModule,],
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



  constructor(private router: Router,
              private productoService: ProductoService,
              private dialog:MatDialog ) { 
              
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

    let datosValidados: boolean = this.validarDatos();

    //se validan las restas
    if (datosValidados) {
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
          const dialogRef=this.dialog.open(MensajeInformacionComponent,{data:'Producto actualizado'});
          this.router.navigate(['productos']);
        },
        error: error => {
          const dialogRef = this.dialog.open(MensajeAlertaComponent,{data:'Ocurrio un error en la actualizacion del producto'})
          this.router.navigate(['productos']);
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
        const dialogRef = this.dialog.open(MensajeAlertaComponent,{data:'el precio debe de ser mayor a cero'});
      }
    } else {
        const dialoRef = this.dialog.open(MensajeAlertaComponent,{data:'verifique las cantidades que entran o salen'})
    }

    return respuesta;
  }




}












