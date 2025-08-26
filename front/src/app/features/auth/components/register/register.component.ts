import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../interfaces/registerRequest.interface';
import { AuthSuccess } from '../../interfaces/authSuccess.interface';
import { User } from 'src/app/interfaces/user.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  public hide = true;
  public onError = false;
  public errorMessage = '';
  public form: FormGroup;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private sessionService: SessionService
  ) {
    // Définition des regex pour les validations
    const nameRegex = /^[a-zA-Z]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(nameRegex)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(passwordRegex)]]
    });
  }

  // Méthodes d'aide pour les messages d'erreur
  public getNameErrorMessage(): string {
    const nameControl = this.form.get('name');
    if (nameControl?.hasError('required')) {
      return 'Le nom est obligatoire';
    }
    if (nameControl?.hasError('pattern')) {
      return 'Le nom ne doit contenir que des lettres';
    }
    return '';
  }

  public getEmailErrorMessage(): string {
    const emailControl = this.form.get('email');
    if (emailControl?.hasError('required')) {
      return 'L\'email est obligatoire';
    }
    if (emailControl?.hasError('email')) {
      return 'L\'email doit être au format valide';
    }
    return '';
  }

  public getPasswordErrorMessage(): string {
    const passwordControl = this.form.get('password');
    if (passwordControl?.hasError('required')) {
      return 'Le mot de passe est obligatoire';
    }
    if (passwordControl?.hasError('pattern')) {
      return 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial';
    }
    return '';
  }

  public submit(): void {
    if (this.form.valid) {
      const registerRequest = this.form.value as RegisterRequest;
      this.authService.register(registerRequest).subscribe({
        next: (response: AuthSuccess) => {
          localStorage.setItem('token', response.token);
          this.authService.me().subscribe({
            next: (user: User) => {
              this.sessionService.logIn(user);
              this.router.navigate(['/posts']);
            },
            error: () => {
              this.onError = true;
              this.errorMessage = 'Une erreur est survenue';
            }
          });
        },
        error: (error: HttpErrorResponse) => {
          this.onError = true;
          if (error.status === 400 && error.error === 'Cet email est déjà utilisé') {
            this.errorMessage = 'Cet email est déjà utilisé';
          } else {
            this.errorMessage = 'Une erreur est survenue';
          }
        }
      });
    }
  }
}