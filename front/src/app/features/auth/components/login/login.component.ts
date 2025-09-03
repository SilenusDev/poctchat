import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user.interface';
import { SessionService } from 'src/app/services/session.service';
import { AuthSuccess } from '../../interfaces/authSuccess.interface';
import { LoginRequest } from '../../interfaces/loginRequest.interface'; 
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent  {
  public hide = true;
  public onError = false;
  public errorMessage = '';

  public form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.min(3)]]
  });

  constructor(private authService: AuthService, 
    private fb: FormBuilder, 
    private router: Router,
    private sessionService: SessionService) { }

    public submit(): void {
      const loginRequest = this.form.value as LoginRequest;
      this.authService.login(loginRequest).subscribe(
        (response: AuthSuccess) => {
          sessionStorage.setItem('token', response.token);
          this.authService.me().subscribe((user: User) => {
            this.sessionService.logIn(user);
            this.router.navigate(['/conversations']);
          });
        },
        error => {
          this.onError = true;
          if (error.status === 401) {
            this.errorMessage = 'Email ou mot de passe incorrect. Veuillez vérifier vos identifiants.';
          } else if (error.status === 0) {
            this.errorMessage = 'Impossible de se connecter au serveur. Veuillez réessayer plus tard.';
          } else if (error.status >= 500) {
            this.errorMessage = 'Erreur serveur temporaire. Veuillez réessayer dans quelques instants.';
          } else {
            this.errorMessage = 'Une erreur inattendue s\'est produite. Veuillez réessayer.';
          }
        }
      );
    }
}