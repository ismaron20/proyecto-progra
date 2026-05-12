import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonCard,
  IonCardHeader, IonCardTitle, IonCardContent, IonItem,
  IonLabel, IonButton, IonDatetime, IonSelect, IonSelectOption,
  IonToggle, IonInput, IonNote, IonCheckbox, IonText,
  IonButtons, IonIcon
} from '@ionic/angular/standalone';
import { BarberiaService } from '../services/barberia.service';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonCard,
    IonCardHeader, IonCardTitle, IonCardContent, IonItem,
    IonLabel, IonButton, IonDatetime, IonSelect, IonSelectOption,
    IonToggle, IonInput, IonNote, IonCheckbox, IonText,
    IonButtons, IonIcon
  ]
})
export class AdminPage {
  bloqueoFecha: string = '';
  bloqueoHora: string = '';
  nuevoBarbero: string = '';
  horasDisponibles = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
  metodoSeleccionado: any = {};

  constructor(
    public barberiaService: BarberiaService,
    private router: Router
  ) {
    this.bloqueoFecha = new Date().toISOString();
    this.barberiaService.metodosPago.forEach(m => this.metodoSeleccionado[m] = true);
    addIcons({ arrowBackOutline });
  }

  bloquearHorario() {
    if (this.bloqueoFecha && this.bloqueoHora) {
      const fecha = this.bloqueoFecha.split('T')[0];
      this.barberiaService.bloquearHorarioManual(fecha, this.bloqueoHora);
      alert(`Horario ${fecha} ${this.bloqueoHora} bloqueado`);
    } else {
      alert('Selecciona fecha y hora');
    }
  }

  async agregarBarbero() {
    if (this.nuevoBarbero.trim()) {
      await this.barberiaService.agregarBarbero(this.nuevoBarbero);
      this.nuevoBarbero = '';
      alert('Barbero agregado correctamente');
      await this.barberiaService.cargarDatos();
    } else {
      alert('Escribe un nombre');
    }
  }

  async toggleBarbero(barbero: any) {
    if (barbero.id) {
      await this.barberiaService.toggleBarbero(barbero.id, barbero.activo);
      await this.barberiaService.cargarDatos();
    }
  }

  // Funcion para volver a la pantalla anterior (login)
  volver() {
    this.router.navigate(['/login']);
  }

  cerrarSesion() {
    this.router.navigate(['/login']);
  }
}