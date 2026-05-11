// Pantalla de login donde el usuario elige si es CLIENTE o ADMINISTRADOR
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, 
  IonItem, IonLabel, IonInput, IonButton, IonText
} from '@ionic/angular/standalone';
import { BarberiaService } from '../services/barberia.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
    IonItem, IonLabel, IonInput, IonButton, IonText
  ]
})
export class LoginPage {
  // Controla que pantalla mostrar: 'seleccion', 'cliente' o 'admin'
  modo: 'seleccion' | 'cliente' | 'admin' = 'seleccion';
  
  // Datos del cliente (registro simple)
  clienteNombre: string = '';
  clienteTelefono: string = '';
  
  // Datos del administrador (autenticacion con Firebase)
  adminEmail: string = '';
  adminPassword: string = '';
  errorAdmin: string = '';  // Mensaje de error si falla el login

  constructor(
    private router: Router,
    private barberiaService: BarberiaService,
    private authService: AuthService
  ) {}

  // Muestra el formulario de cliente
  seleccionarCliente() {
    this.modo = 'cliente';
  }

  // Muestra el formulario de administrador
  seleccionarAdmin() {
    this.modo = 'admin';
  }

  // Vuelve a la pantalla de seleccion
  volver() {
    this.modo = 'seleccion';
    this.errorAdmin = '';
  }

  // Registra un nuevo cliente (guarda en localStorage y en el servicio)
  registrarCliente() {
    if (!this.clienteNombre || !this.clienteTelefono) {
      alert('Por favor completa tu nombre y telefono');
      return;
    }

    const cliente = {
      nombre: this.clienteNombre,
      telefono: this.clienteTelefono
    };
    localStorage.setItem('clienteBarberia', JSON.stringify(cliente));
    this.barberiaService.clienteActual = cliente;
    
    alert(`Bienvenido ${this.clienteNombre}!`);
    this.router.navigate(['/home']);
  }

  // Ingresa como administrador usando autenticacion de Firebase
  async ingresarAdmin() {
    if (!this.adminEmail || !this.adminPassword) {
      this.errorAdmin = 'Ingresa correo y contrasena';
      return;
    }

    // Llama al servicio de autenticacion
    const success = await this.authService.login(this.adminEmail, this.adminPassword);
    
    if (success) {
      alert('Bienvenido Administrador');
      this.router.navigate(['/admin']);
    } else {
      this.errorAdmin = 'Correo o contrasena incorrectos';
    }
  }
}