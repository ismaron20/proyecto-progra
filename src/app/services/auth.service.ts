// Servicio de autenticacion con Firebase
// Maneja el login, logout y estado del usuario administrador
import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Almacena el usuario actual (null si no esta autenticado)
  usuarioActual: User | null = null;

  constructor(private auth: Auth) {
    // Escucha los cambios en el estado de autenticacion
    // Se ejecuta cuando el usuario inicia o cierra sesion
    onAuthStateChanged(this.auth, (user) => {
      this.usuarioActual = user;
      console.log('Usuario autenticado:', user?.email);
    });
  }

  // Inicia sesion con correo y contrasena
  // Retorna true si es exitoso, false si hay error
  async login(email: string, password: string): Promise<boolean> {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      console.log('Login exitoso:', result.user?.email);
      return true;
    } catch (error) {
      console.error('Error de login:', error);
      return false;
    }
  }

  // Cierra la sesion del usuario
  async logout(): Promise<void> {
    await signOut(this.auth);
    console.log('Sesion cerrada');
  }

  // Verifica si hay un usuario autenticado
  isAuthenticated(): boolean {
    return this.usuarioActual !== null;
  }
}