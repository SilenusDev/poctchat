import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { LoginRequest } from '../interfaces/loginRequest.interface';
import { AuthSuccess  } from '../interfaces/authSuccess.interface';
import { RegisterRequest } from '../interfaces/registerRequest.interface';
import { User } from 'src/app/interfaces/user.interface';
import { MeResponse } from 'src/app/interfaces/me-response.interface';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private pathService = 'api/auth';

  constructor(private httpClient: HttpClient) { }

  register(request: RegisterRequest): Observable<AuthSuccess> {
    return this.httpClient.post<AuthSuccess>(`${this.pathService}/register`, request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          // Retransmet l'erreur telle quelle pour être traitée dans le composant
          return throwError(() => error);
        })
      );
  }

  public login(loginRequest: LoginRequest): Observable<AuthSuccess> {
    return this.httpClient.post<AuthSuccess>(`${this.pathService}/login`, loginRequest);
  }

  public me(): Observable<User> {
    return this.httpClient.get<MeResponse>(`${this.pathService}/me`).pipe(
      map((response: MeResponse): User => {
        // Transformer MeResponse en User
        return {
          id: response.id,
          name: response.username,
          email: response.email,
          role: response.role,  // Inclure le rôle dans la transformation
          createdAt: response.createdAt
        };
      })
    );
  }
}





