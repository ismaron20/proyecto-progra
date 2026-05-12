import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, 
  IonItem, IonLabel, IonInput, IonButton, IonText, IonIcon
} from '@ionic/angular/standalone';
import { BarberiaService } from '../services/barberia.service';
import { AuthService } from '../services/auth.service';
import { addIcons } from 'ionicons';
import { personOutline, callOutline, mailOutline, lockClosedOutline, cutOutline, shieldOutline, shieldCheckmarkOutline, arrowBackOutline, arrowForwardOutline, chevronForwardOutline } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
    IonItem, IonLabel, IonInput, IonButton, IonText, IonIcon
  ]
})
export class LoginPage {
  modo: 'seleccion' | 'cliente' | 'admin' = 'seleccion';
  
  clienteNombre: string = '';
  clienteTelefono: string = '';
  
  adminEmail: string = '';
  adminPassword: string = '';
  errorAdmin: string = '';

  constructor(
    private router: Router,
    private barberiaService: BarberiaService,
    private authService: AuthService
  ) {
    addIcons({
      personOutline,
      callOutline,
      mailOutline,
      lockClosedOutline,
      cutOutline,
      shieldOutline,
      shieldCheckmarkOutline,
      arrowBackOutline,
      arrowForwardOutline,
      chevronForwardOutline
    });
  }

  seleccionarCliente() {
    this.modo = 'cliente';
  }

  seleccionarAdmin() {
    this.modo = 'admin';
  }

  volver() {
    this.modo = 'seleccion';
    this.errorAdmin = '';
  }

  registrarCliente() {
    if (!this.clienteNombre || !this.clienteTelefono) {
      alert('Por favor completa tu nombre y teléfono');
      return;
    }

    const cliente = {
      nombre: this.clienteNombre,
      telefono: this.clienteTelefono
    };
    localStorage.setItem('clienteBarberia', JSON.stringify(cliente));
    this.barberiaService.clienteActual = cliente;
    
    alert(`¡Bienvenido ${this.clienteNombre}!`);
    this.router.navigate(['/home']);
  }

  async ingresarAdmin() {
    console.log('=== INTENTANDO LOGIN ===');
    console.log('Correo:', this.adminEmail);
    console.log('Contraseña:', this.adminPassword);
    
    if (!this.adminEmail || !this.adminPassword) {
      this.errorAdmin = 'Ingresa correo y contraseña';
      return;
    }

    const success = await this.authService.login(this.adminEmail, this.adminPassword);
    
    if (success) {
      console.log('Login exitoso');
      alert('Bienvenido Administrador');
      this.router.navigate(['/admin']);
    } else {
      console.log('Login fallido');
      this.errorAdmin = 'Correo o contraseña incorrectos';
    }
  }
}