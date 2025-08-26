import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subject } from 'src/app/interfaces/subject.interface';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  private baseUrl = 'api/subjects'; // Correspond à la route de votre API Spring Boot

  constructor(private httpClient: HttpClient) { }

  /**
   * Abonne un utilisateur à un sujet
   * @param userId L'identifiant de l'utilisateur
   * @param subjectId L'identifiant du sujet
   * @returns Un observable de type void (pas de retour)
   */
  public subscribeSubject(userId: number, subjectId: number): Observable<void> {
    const body = { userId, subjectId };
    return this.httpClient.post<void>(`${this.baseUrl}/subscribe`, body);
  }

  /**
   * Désabonne un utilisateur d'un sujet
   * @param userId L'identifiant de l'utilisateur
   * @param subjectId L'identifiant du sujet
   * @returns Un observable de type void (pas de retour)
   */
  public unsubscribeSubject(userId: number, subjectId: number): Observable<void> {
    const body = { userId, subjectId };
    return this.httpClient.request<void>('DELETE', `${this.baseUrl}/unsubscribe`, { body });
  }
    
}