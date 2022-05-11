import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { list } from '@angular/fire/database';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { LoginComponent } from './components/login/login.component';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { FirebaseService } from './services/firebase.service';
import { AngularFireModule } from '@angular/fire/compat';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideDatabase(() => getDatabase()),
    provideAuth(() => getAuth()),
  ],
  providers: [FirebaseService],
  bootstrap: [AppComponent]
})
export class AppModule { 
  

}
