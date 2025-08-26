import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { MeComponent } from './components/me/me.component';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HeaderComponent } from './components/header/header.component';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { AuthModule } from 'src/app/features/auth/auth.module'; 
import { SubjectComponent } from './components/subject/subject.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// Définition d'un tableau regroupant tous les modules Angular Material utilisés
const materialModule = [
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatToolbarModule,
  MatSnackBarModule,
];

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    MeComponent,  
    HeaderComponent,
    SubjectComponent,
    ClickOutsideDirective
  ],
  imports: [
    BrowserModule, 
    ReactiveFormsModule,       
    AuthModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    HttpClientModule,
    ...materialModule,
    CommonModule,
    RouterModule,
    AppRoutingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }