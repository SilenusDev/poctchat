import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false;
  currentRoute: string = '';
  
  // Ajout des propriétés pour contrôler l'affichage
  showHeader = true;
  showLogoOnly = false;
  
  constructor(private sessionService: SessionService, private router: Router) {}
  
  ngOnInit() {
    // S'abonner aux événements de navigation
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd | any) => {
      this.currentRoute = event.urlAfterRedirects;
      this.updateHeaderVisibility();
    });
    
    // Initialiser l'état au démarrage
    this.updateHeaderVisibility();
  }
  
  private updateHeaderVisibility() {
    // Masquer complètement sur /enter
    if (this.currentRoute.includes('/enter')) {
      this.showHeader = false;
      return;
    }
    
    // Afficher uniquement le logo sur /login et /register
    if (this.currentRoute.includes('/login') || this.currentRoute.includes('/register')) {
      this.showHeader = true;
      this.showLogoOnly = true;
      return;
    }
    
    // Affichage normal sur les autres routes
    this.showHeader = true;
    this.showLogoOnly = false;
  }

  logout(): void {
    this.sessionService.logOut();
    this.router.navigate(['/enter']); // Redirige vers la page de connexion après déconnexion
  }
  
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  
  closeMenu() {
    this.isMenuOpen = false;
  }
  
  // Vérifier si l'utilisateur est sur la page des articles
  isPostsPage(): boolean {
    return this.currentRoute.includes('/posts');
  }

  isSubjectsPage(): boolean {
    return this.router.url === '/subjects';
  }
}