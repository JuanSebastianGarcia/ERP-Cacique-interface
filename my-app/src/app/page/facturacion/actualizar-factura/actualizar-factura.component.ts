import { Component } from '@angular/core';
import { FacturaService } from '../../../core/service/factura.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-actualizar-factura',
  standalone: true,
  imports: [MatIconModule,
    CommonModule
  ],
  templateUrl: './actualizar-factura.component.html',
  styleUrl: './actualizar-factura.component.css'
})
export class ActualizarFacturaComponent {

  public valorTotal: number = 0;
  public valorPagado: number = 0;
  public productos: any[] = [];




  constructor (private facturaService:FacturaService){

  }


  
  ngOnInit() {
    const factura = this.facturaService.buscarFactura();
    console.log(factura);
  }

  public eliminarProducto(producto:any): void {
  
  }


  public agregarProducto(): void {
  
  }

}
