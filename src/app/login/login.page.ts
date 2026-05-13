import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent, IonInput, IonButton, IonText, IonIcon
} from '@ionic/angular/standalone';
import { BarberiaService } from '../services/barberia.service';
import { AuthService } from '../services/auth.service';
import { addIcons } from 'ionicons';
import { 
  mailOutline, lockClosedOutline, cutOutline, logInOutline,
  logoGoogle, refreshOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonInput, IonButton, IonText, IonIcon
  ]
})
export class LoginPage {
  email: string = '';
  password: string = '';
  errorMensaje: string = '';
  infoMensaje: string = '';
  cargando: boolean = false;
  mostrarContrasena: boolean = false;

  private readonly ADMIN_EMAIL = 'admin@barberia.com';

  constructor(
    private router: Router,
    private barberiaService: BarberiaService,
    private authService: AuthService
  ) {
    addIcons({
      mailOutline, lockClosedOutline, cutOutline, logInOutline,
      logoGoogle, refreshOutline
    });
  }

  onEmailChange() {
    // Mostrar campo de contraseña solo si es el admin
    this.mostrarContrasena = this.email.toLowerCase() === this.ADMIN_EMAIL;
    if (!this.mostrarContrasena) {
      this.password = '';
    }
    this.errorMensaje = '';
  }

  async iniciarSesion() {
    this.errorMensaje = '';
    this.infoMensaje = '';
    
    if (!this.email || !this.email.includes('@')) {
      this.errorMensaje = 'Ingresa un correo electrónico válido';
      return;
    }

    this.cargando = true;

    // Caso 1: Es administrador
    if (this.email.toLowerCase() === this.ADMIN_EMAIL) {
      if (!this.password) {
        this.errorMensaje = 'Ingresa la contraseña de administrador';
        this.cargando = false;
        return;
      }
      
      const success = await this.authService.login(this.email, this.password);
      
      if (success) {
        this.infoMensaje = 'Bienvenido Administrador';
        setTimeout(() => {
          this.router.navigate(['/admin']);
        }, 1000);
      } else {
        this.errorMensaje = 'Contraseña incorrecta';
        this.password = '';
      }
    } 
    // Caso 2: Es cliente (registro automático)
    else {
      const nombreCliente = this.email.split('@')[0];
      const cliente = {
        nombre: nombreCliente,
        telefono: '00000000'
      };
      localStorage.setItem('clienteBarberia', JSON.stringify(cliente));
      this.barberiaService.clienteActual = cliente;
      
      this.infoMensaje = `¡Bienvenido ${nombreCliente}!`;
      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 1000);
    }
    
    this.cargando = false;
  }

  async loginConGoogle() {
    this.cargando = true;
    this.errorMensaje = '';
    this.infoMensaje = '';
    
    const success = await this.authService.loginWithGoogle();
    
    if (success) {
      const email = this.authService.usuarioActual?.email || '';
      
      if (email.toLowerCase() === this.ADMIN_EMAIL) {
        this.infoMensaje = 'Bienvenido Administrador';
        setTimeout(() => {
          this.router.navigate(['/admin']);
        }, 1000);
      } else {
        const nombreCliente = email.split('@')[0];
        const cliente = {
          nombre: nombreCliente,
          telefono: '00000000'
        };
        localStorage.setItem('clienteBarberia', JSON.stringify(cliente));
        this.barberiaService.clienteActual = cliente;
        
        this.infoMensaje = `¡Bienvenido ${nombreCliente}!`;
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1000);
      }
    } else {
      this.errorMensaje = 'Error al iniciar sesión con Google';
    }
    
    this.cargando = false;
  }
}