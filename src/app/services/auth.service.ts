import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  usuarioActual: User | null = null;

  constructor(private auth: Auth) {
    onAuthStateChanged(this.auth, (user) => {
      this.usuarioActual = user;
      console.log('Usuario autenticado:', user?.email);
    });
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      console.log('Intentando login con:', email);
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      console.log('Login exitoso:', result.user?.email);
      return true;
    } catch (error: any) {
      console.error('Error de login:', error.code, error.message);
      return false;
    }
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    console.log('Sesion cerrada');
  }

  isAuthenticated(): boolean {
    return this.usuarioActual !== null;
  }
}