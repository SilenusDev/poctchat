import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subject } from 'src/app/interfaces/subject.interface';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  private baseUrl = 'api/subjects'; // Correspond à la route de votre API Spring Boot pour les sujets

  constructor(private httpClient: HttpClient) { }

  /**
   * Récupère la liste de tous les sujets disponibles
   * @returns Un observable de la liste des sujets
   */
  public getAllSubjects(): Observable<Subject[]> {
    return this.httpClient.get<Subject[]>(`${this.baseUrl}`);
  }
}