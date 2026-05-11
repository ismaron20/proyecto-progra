import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonCard, 
  IonCardHeader, IonCardTitle, IonCardContent, IonItem, 
  IonLabel, IonInput, IonButton, IonSegment, IonSegmentButton,
  IonList, IonRadioGroup, IonRadio, IonNote, IonDatetime,
  IonText, IonButtons
} from '@ionic/angular/standalone';
import { BarberiaService, Cliente, Cita } from '../services/barberia.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonCard,
    IonCardHeader, IonCardTitle, IonCardContent, IonItem,
    IonLabel, IonInput, IonButton, IonSegment, IonSegmentButton,
    IonList, IonRadioGroup, IonRadio, IonNote, IonDatetime,
    IonText, IonButtons
  ]
})
export class HomePage implements OnInit {
  cliente: Cliente = { nombre: '', telefono: '' };
  cita: any = { barbero: '', fecha: '', hora: '' };
  servicioSeleccionado: string = '';
  fechaMinima: string = '';
  barberosActivos: any[] = [];
  
  servicios = [
    { nombre: 'Corte clasico', precio: 8000 },
    { nombre: 'Barba completa', precio: 5000 },
    { nombre: 'Fade', precio: 10000 },
    { nombre: 'Corte + Barba', precio: 12000 }
  ];
  
  horasDisponibles = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

  constructor(
    public barberiaService: BarberiaService,
    private router: Router
  ) {}

  ngOnInit() {
    this.fechaMinima = new Date().toISOString();
    this.cargarClienteGuardado();
    this.cargarBarberos();
  }

  cargarBarberos() {
    // Cargar barberos directamente del servicio
    this.barberosActivos = this.barberiaService.obtenerBarberosActivos();
    console.log('Barberos cargados:', this.barberosActivos);
  }

  get servicioActual() {
    return this.servicios.find(s => s.nombre === this.servicioSeleccionado);
  }

  cargarClienteGuardado() {
    if (this.barberiaService.clienteActual) {
      this.cliente = this.barberiaService.clienteActual;
    } else {
      const clienteGuardado = localStorage.getItem('clienteBarberia');
      if (clienteGuardado) {
        this.cliente = JSON.parse(clienteGuardado);
      }
    }
  }

  guardarCliente() {
    if (this.cliente.nombre && this.cliente.telefono) {
      localStorage.setItem('clienteBarberia', JSON.stringify(this.cliente));
      this.barberiaService.clienteActual = this.cliente;
      alert('Datos guardados correctamente');
    } else {
      alert('Por favor completa nombre y telefono');
    }
  }

  isHoraOcupada(hora: string): boolean {
    if (!this.cita.fecha) return false;
    return this.barberiaService.isHorarioOcupado(this.cita.fecha, hora);
  }

  getColorHora(hora: string): string {
    if (this.cita.hora === hora) return 'primary';
    if (this.isHoraOcupada(hora)) return 'danger';
    return 'success';
  }

  seleccionarHora(hora: string) {
    if (!this.isHoraOcupada(hora)) {
      this.cita.hora = hora;
    }
  }

  citaValida(): boolean {
    return !!(this.cliente.nombre && 
              this.cliente.telefono && 
              this.cita.barbero && 
              this.servicioSeleccionado && 
              this.cita.fecha && 
              this.cita.hora);
  }

  async confirmarCita() {
    if (!this.citaValida()) {
      alert('Por favor completa todos los campos');
      return;
    }

    const servicioActual = this.servicios.find(s => s.nombre === this.servicioSeleccionado);
    
    const nuevaCita: Cita = {
      id: '',
      cliente: { ...this.cliente },
      barbero: this.cita.barbero,
      servicio: this.servicioSeleccionado,
      precio: servicioActual?.precio || 0,
      fecha: this.cita.fecha.split('T')[0],
      hora: this.cita.hora,
      estado: 'confirmada',
      pagoPendiente: true
    };
    
    await this.barberiaService.guardarCita(nuevaCita);
    alert('Cita agendada con exito');
    
    this.cita = { barbero: '', fecha: '', hora: '' };
    this.servicioSeleccionado = '';
  }

  irAdmin() {
    this.router.navigate(['/admin']);
  }

  cerrarSesion() {
    localStorage.removeItem('clienteBarberia');
    this.barberiaService.clienteActual = null;
    this.router.navigate(['/login']);
  }
}