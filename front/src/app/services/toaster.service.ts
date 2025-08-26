// src/app/services/toaster.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ToastMessage {
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class ToasterService {
  private messageSubject = new BehaviorSubject<ToastMessage | null>(null);
  
  // Observable exposé pour les composants qui veulent s'abonner
  public message$: Observable<ToastMessage | null> = this.messageSubject.asObservable();
  
  constructor() {}
  
  // Méthode pour définir un nouveau message
  setMessage(message: ToastMessage): void {
    this.messageSubject.next(message);
  }
  
  // Méthode pour effacer le message après l'avoir affiché
  clearMessage(): void {
    this.messageSubject.next(null);
  }
}