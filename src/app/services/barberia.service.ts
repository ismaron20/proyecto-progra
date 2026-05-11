import { Injectable } from '@angular/core';
import { FirebaseService, Cita as FirebaseCita } from './firebase.service';

export interface Cliente {
  nombre: string;
  telefono: string;
}

export interface Cita {
  id?: string;
  cliente: Cliente;
  barbero: string;
  servicio: string;
  precio: number;
  fecha: string;
  hora: string;
  estado: string;
  pagoPendiente: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class BarberiaService {
  public citas: any[] = [];
  // BARBEROS FIJOS - NO DEPENDEN DE FIREBASE
  public barberos: any[] = [
    { id: '1', nombre: 'Carlos', calificacion: 4.8, activo: true },
    { id: '2', nombre: 'Luis', calificacion: 4.9, activo: true },
    { id: '3', nombre: 'Rodrigo', calificacion: 4.7, activo: true }
  ];
  public horariosOcupados: string[] = [];
  public notificaciones: any[] = [];
  public ingresosDiarios: number = 0;
  public ingresosMensuales: number = 0;
  public metaMensual: number = 500000;
  public metodosPago: string[] = ['SINPE Movil', 'PayPal'];
  public clienteActual: any = null;

  constructor(private firebaseService: FirebaseService) {
    this.inicializar();
  }

  async inicializar() {
    console.log('Barberos fijos cargados:', this.barberos);
    await this.cargarDatos();
  }

  async cargarDatos() {
    console.log('Cargando datos desde Firebase...');
    
    this.citas = await this.firebaseService.obtenerCitas();
    
    this.ingresosDiarios = await this.firebaseService.obtenerIngresosHoy();
    this.ingresosMensuales = await this.firebaseService.obtenerIngresosMes();
    
    const hoy = new Date().toISOString().split('T')[0];
    this.horariosOcupados = await this.firebaseService.obtenerHorariosOcupados(hoy);
    
    console.log('Barberos disponibles:', this.barberos.length);
  }

  // Retorna solo los barberos activos
  obtenerBarberosActivos() {
    const activos = this.barberos.filter(b => b.activo === true);
    console.log('Barberos activos:', activos);
    return activos;
  }

  async guardarCita(cita: any) {
    const nuevaCita: FirebaseCita = {
      clienteNombre: cita.cliente.nombre,
      clienteTelefono: cita.cliente.telefono,
      barbero: cita.barbero,
      servicio: cita.servicio,
      precio: cita.precio,
      fecha: cita.fecha,
      hora: cita.hora,
      estado: 'confirmada',
      pagoPendiente: true,
      fechaCreacion: new Date()
    };
    
    await this.firebaseService.agregarCita(nuevaCita);
    await this.cargarDatos();
    this.agregarNotificacion(`${cita.cliente.nombre} agendo ${cita.servicio}`);
  }

  async cancelarCita(id: string) {
    await this.firebaseService.cancelarCita(id);
    await this.cargarDatos();
  }

  isHorarioOcupado(fecha: string, hora: string): boolean {
    if (!fecha) return false;
    return this.horariosOcupados.includes(hora);
  }

  async bloquearHorarioManual(fecha: string, hora: string) {
    await this.firebaseService.bloquearHorario(fecha, hora);
    await this.cargarDatos();
    this.agregarNotificacion(`Bloqueo manual: ${fecha} ${hora}`);
  }

  async agregarBarbero(nombre: string) {
    const nuevoBarbero = {
      id: Date.now().toString(),
      nombre: nombre,
      calificacion: 5.0,
      activo: true
    };
    this.barberos.push(nuevoBarbero);
    this.agregarNotificacion(`Nuevo barbero: ${nombre}`);
    console.log('Barbero agregado:', this.barberos);
  }

  async toggleBarbero(id: string, activo: boolean) {
    const barbero = this.barberos.find(b => b.id === id);
    if (barbero) {
      barbero.activo = activo;
      console.log('Barbero actualizado:', barbero);
    }
  }

  getPorcentajeMeta(): number {
    return (this.ingresosMensuales / this.metaMensual) * 100;
  }

  agregarNotificacion(mensaje: string) {
    this.notificaciones.unshift({
      mensaje,
      timestamp: new Date(),
      hace: this.getTiempoTexto(new Date())
    });
    if (this.notificaciones.length > 20) this.notificaciones.pop();
  }

  getTiempoTexto(fecha: Date): string {
    const diff = Math.floor((new Date().getTime() - fecha.getTime()) / 1000);
    if (diff < 60) return 'hace unos segundos';
    if (diff < 3600) return `hace ${Math.floor(diff / 60)} minutos`;
    return `hace ${Math.floor(diff / 3600)} horas`;
  }
}