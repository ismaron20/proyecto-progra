// Servicio que conecta directamente con Firestore (base de datos en la nube)
// Contiene todas las operaciones CRUD: crear, leer, actualizar, eliminar
import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc, orderBy } from '@angular/fire/firestore';

// Interfaz que define la estructura de una cita en Firebase
export interface Cita {
  id?: string;
  clienteNombre: string;
  clienteTelefono: string;
  barbero: string;
  servicio: string;
  precio: number;
  fecha: string;
  hora: string;
  estado: 'pendiente' | 'confirmada' | 'cancelada';
  pagoPendiente: boolean;
  fechaCreacion: Date;
}

// Interfaz que define la estructura de un barbero en Firebase
export interface Barbero {
  id?: string;
  nombre: string;
  calificacion: number;
  activo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(private firestore: Firestore) {}

  // ========== CITAS ==========

  // Guarda una nueva cita en la coleccion 'citas' de Firebase
  async agregarCita(cita: Cita): Promise<string> {
    try {
      const docRef = await addDoc(collection(this.firestore, 'citas'), {
        ...cita,
        fechaCreacion: new Date()  // Agrega la fecha actual automaticamente
      });
      console.log('Cita guardada en Firebase con ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error al agregar cita:', error);
      throw error;
    }
  }

  // Obtiene todas las citas ordenadas por fecha descendente (mas reciente primero)
  async obtenerCitas(): Promise<Cita[]> {
    try {
      const q = query(collection(this.firestore, 'citas'), orderBy('fecha', 'desc'));
      const querySnapshot = await getDocs(q);
      const citas: Cita[] = [];
      querySnapshot.forEach(doc => {
        citas.push({ id: doc.id, ...doc.data() } as Cita);
      });
      return citas;
    } catch (error) {
      console.error('Error al obtener citas:', error);
      return [];
    }
  }

  // Obtiene las citas de una fecha especifica (para mostrar horarios ocupados)
  async obtenerCitasPorFecha(fecha: string): Promise<Cita[]> {
    try {
      const q = query(
        collection(this.firestore, 'citas'),
        where('fecha', '==', fecha),
        orderBy('hora', 'asc')
      );
      const querySnapshot = await getDocs(q);
      const citas: Cita[] = [];
      querySnapshot.forEach(doc => {
        citas.push({ id: doc.id, ...doc.data() } as Cita);
      });
      return citas;
    } catch (error) {
      console.error('Error al obtener citas por fecha:', error);
      return [];
    }
  }

  // Cancela una cita (cambia estado a 'cancelada' en lugar de eliminarla)
  async cancelarCita(id: string): Promise<void> {
    try {
      const citaRef = doc(this.firestore, 'citas', id);
      await updateDoc(citaRef, { estado: 'cancelada' });
    } catch (error) {
      console.error('Error al cancelar cita:', error);
    }
  }

  // Elimina permanentemente una cita (solo para administradores)
  async eliminarCita(id: string): Promise<void> {
    try {
      const citaRef = doc(this.firestore, 'citas', id);
      await deleteDoc(citaRef);
    } catch (error) {
      console.error('Error al eliminar cita:', error);
    }
  }

  // ========== BARBEROS ==========

  // Agrega un nuevo barbero a la coleccion 'barberos'
  async agregarBarbero(barbero: Barbero): Promise<string> {
    try {
      const docRef = await addDoc(collection(this.firestore, 'barberos'), barbero);
      return docRef.id;
    } catch (error) {
      console.error('Error al agregar barbero:', error);
      throw error;
    }
  }

  // Obtiene todos los barberos
  async obtenerBarberos(): Promise<Barbero[]> {
    try {
      const querySnapshot = await getDocs(collection(this.firestore, 'barberos'));
      const barberos: Barbero[] = [];
      querySnapshot.forEach(doc => {
        barberos.push({ id: doc.id, ...doc.data() } as Barbero);
      });
      return barberos;
    } catch (error) {
      console.error('Error al obtener barberos:', error);
      return [];
    }
  }

  // Obtiene solo los barberos activos (para mostrar al cliente)
  async obtenerBarberosActivos(): Promise<Barbero[]> {
    try {
      const q = query(
        collection(this.firestore, 'barberos'),
        where('activo', '==', true)
      );
      const querySnapshot = await getDocs(q);
      const barberos: Barbero[] = [];
      querySnapshot.forEach(doc => {
        barberos.push({ id: doc.id, ...doc.data() } as Barbero);
      });
      return barberos;
    } catch (error) {
      console.error('Error al obtener barberos activos:', error);
      return [];
    }
  }

  // Actualiza los datos de un barbero (ej: activar/desactivar)
  async actualizarBarbero(id: string, datos: Partial<Barbero>): Promise<void> {
    try {
      const barberoRef = doc(this.firestore, 'barberos', id);
      await updateDoc(barberoRef, datos);
    } catch (error) {
      console.error('Error al actualizar barbero:', error);
    }
  }

  // ========== FINANZAS ==========

  // Calcula los ingresos totales del dia de hoy
  async obtenerIngresosHoy(): Promise<number> {
    const hoy = new Date().toISOString().split('T')[0];  // Formato YYYY-MM-DD
    try {
      const q = query(
        collection(this.firestore, 'citas'),
        where('fecha', '==', hoy),
        where('estado', '==', 'confirmada')
      );
      const querySnapshot = await getDocs(q);
      let total = 0;
      querySnapshot.forEach(doc => {
        total += doc.data()['precio'] || 0;
      });
      return total;
    } catch (error) {
      console.error('Error al obtener ingresos hoy:', error);
      return 0;
    }
  }

  // Calcula los ingresos totales del mes actual
  async obtenerIngresosMes(): Promise<number> {
    const ahora = new Date();
    const mes = ahora.getMonth() + 1;
    const anio = ahora.getFullYear();
    
    try {
      const citas = await this.obtenerCitas();
      let total = 0;
      citas.forEach(cita => {
        const fechaCita = new Date(cita.fecha);
        if (fechaCita.getMonth() + 1 === mes && 
            fechaCita.getFullYear() === anio && 
            cita.estado === 'confirmada') {
          total += cita.precio;
        }
      });
      return total;
    } catch (error) {
      console.error('Error al obtener ingresos mes:', error);
      return 0;
    }
  }

  // ========== HORARIOS OCUPADOS ==========

  // Obtiene las horas ya ocupadas para una fecha especifica
  async obtenerHorariosOcupados(fecha: string): Promise<string[]> {
    try {
      const q = query(
        collection(this.firestore, 'citas'),
        where('fecha', '==', fecha),
        where('estado', '==', 'confirmada')
      );
      const querySnapshot = await getDocs(q);
      const horas: string[] = [];
      querySnapshot.forEach(doc => {
        horas.push(doc.data()['hora']);
      });
      return horas;
    } catch (error) {
      console.error('Error al obtener horarios ocupados:', error);
      return [];
    }
  }

  // Bloquea un horario manualmente (crea una cita especial como bloqueo)
  async bloquearHorario(fecha: string, hora: string): Promise<void> {
    await this.agregarCita({
      clienteNombre: 'BLOQUEADO',
      clienteTelefono: '00000000',
      barbero: 'Sistema',
      servicio: 'Bloqueo manual',
      precio: 0,
      fecha: fecha,
      hora: hora,
      estado: 'cancelada',
      pagoPendiente: false,
      fechaCreacion: new Date()
    });
  }
}