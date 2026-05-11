import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonCard,
  IonCardHeader, IonCardTitle, IonCardContent, IonItem,
  IonLabel, IonButton, IonDatetime, IonSelect, IonSelectOption,
  IonToggle, IonInput, IonNote, IonCheckbox, IonText,
  IonButtons, IonRouterLink
} from '@ionic/angular/standalone';
import { BarberiaService } from '../services/barberia.service';

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
    IonButtons, IonRouterLink
  ]
})
export class AdminPage {
  bloqueoFecha: string = '';
  bloqueoHora: string = '';
  nuevoBarbero: string = '';
  horasDisponibles = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
  metodoSeleccionado: any = {};

  constructor(public barberiaService: BarberiaService) {
    this.bloqueoFecha = new Date().toISOString();
    this.barberiaService.metodosPago.forEach(m => this.metodoSeleccionado[m] = true);
  }

  bloquearHorario() {
    if (this.bloqueoFecha && this.bloqueoHora) {
      const fecha = this.bloqueoFecha.split('T')[0];
      this.barberiaService.bloquearHorarioManual(fecha, this.bloqueoHora);
      alert(`✅ Horario ${fecha} ${this.bloqueoHora} bloqueado`);
    }
  }

  agregarBarbero() {
    if (this.nuevoBarbero.trim()) {
      this.barberiaService.agregarBarbero(this.nuevoBarbero);
      this.nuevoBarbero = '';
      alert('✅ Barbero agregado');
    }
  }
}