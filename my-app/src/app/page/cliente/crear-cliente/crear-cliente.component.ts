// Angular core and required modules
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Services and Dialog references
import { ClienteService } from '../../../core/service/cliente.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-registrar-cliente',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './crear-cliente.component.html',
  styleUrls: ['./crear-cliente.component.css']
})
export class CrearClienteComponent {

  // Object to bind form input values
  public cliente = {
    nombre: '',
    cedula: '',
    telefono: '',
    email: '',
    direccion: ''
  };

  constructor(
    private clienteService: ClienteService,
    private dialogRef: MatDialogRef<CrearClienteComponent>
  ) {}

  /**
   * Validates required fields and sends client creation request to the backend.
   * Closes the dialog with the server response if successful.
   */
  public registrar(): void {
    if (this.cliente.nombre && this.cliente.cedula && this.cliente.telefono) {
      this.clienteService.crearCliente(this.cliente).subscribe({
        next: response => {
          this.dialogRef.close(response); // Close dialog after successful creation
        },
        error: error => {
          console.error('Error creating client', error);
          alert('Error creating client');
        },
      });
    } else {
      alert('Please complete all required fields: Name, ID, and Phone');
    }
  }

  /**
   * Cancels the operation and closes the dialog.
   */
  public cancelar(): void {
    console.log('Client registration canceled');
    this.dialogRef.close();
  }

  /**
   * Closes the modal dialog.
   */
  public cerrarModal(): void {
    this.cancelar();
  }
}
