import { Injectable } from '@angular/core';
import { 
  Auth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User,
  GoogleAuthProvider,
  signInWithPopup
} from '@angular/fire/auth';

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
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      console.log('Login exitoso:', result.user?.email);
      return true;
    } catch (error: any) {
      console.error('Error de login:', error.code);
      return false;
    }
  }

  async loginWithGoogle(): Promise<boolean> {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      console.log('Login con Google exitoso:', result.user?.email);
      return true;
    } catch (error: any) {
      console.error('Error login con Google:', error.code);
      return false;
    }
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    console.log('Sesión cerrada');
  }

  isAuthenticated(): boolean {
    return this.usuarioActual !== null;
  }
}