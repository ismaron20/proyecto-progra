// Configuracion de rutas de la aplicacion
// Define que pantalla mostrar segun la URL
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },  // Al iniciar, va a login
  { path: 'login', loadComponent: () => import('./login/login.page').then(m => m.LoginPage) },  // Pantalla de login
  { path: 'home', loadComponent: () => import('./home/home.page').then(m => m.HomePage) },      // Pantalla del cliente
  { path: 'admin', loadComponent: () => import('./admin/admin.page').then(m => m.AdminPage) },   // Panel de administrador
];