// Configuracion principal de la aplicacion Angular/Ionic
// Aqui se importan los modulos necesarios como Firebase, almacenamiento local, etc.
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { IonicStorageModule } from '@ionic/storage-angular';
import { routes } from './app.routes';

// Importaciones de Firebase
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),                                    // Configura las rutas de navegacion
    provideIonicAngular(),                                   // Configura Ionic
    importProvidersFrom(IonicStorageModule.forRoot()),       // Almacenamiento local del telefono
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),  // Inicializa Firebase
    provideFirestore(() => getFirestore()),                  // Habilita Firestore (base de datos)
    provideAuth(() => getAuth())                             // Habilita Autenticacion (login)
  ]
};