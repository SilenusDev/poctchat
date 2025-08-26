import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from 'src/app/features/post/services/posts.service';
import { SubscribedPostResponse } from 'src/app/interfaces/subscribed-post-response.interface';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { User } from 'src/app/interfaces/user.interface';
import { ToasterService } from 'src/app/services/toaster.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {
  posts: SubscribedPostResponse[] = [];
  userId!: number;
  showSortMenu = false;
  currentSortOption = 'date';
  currentSortLabel = 'Date (récent)';
  
  // Subscription pour le message toast
  private toasterSubscription: Subscription | null = null;
  
  constructor(
    private postService: PostService,
    private authService: AuthService,
    private toasterService: ToasterService,
    private snackBar: MatSnackBar
  ) {}
  
  ngOnInit(): void {
    // S'abonner aux messages toast
    this.toasterSubscription = this.toasterService.message$.subscribe(message => {
      if (message) {
        // Afficher le message toast
        this.snackBar.open(message.message, 'Fermer', {
          duration: 3000,
          panelClass: [`${message.type}-snackbar`, 'centered-snackbar'],
          horizontalPosition: 'center',
          verticalPosition: 'top' // Vous pouvez utiliser 'top', 'bottom' ou 'center'
        });
        
        // Effacer le message pour éviter de l'afficher à nouveau
        this.toasterService.clearMessage();
      }
    });
    
    // Récupérer l'utilisateur connecté
    this.authService.me().subscribe((user: User) => {
      this.userId = user.id;
      this.loadPosts();
    });
  }
  
  // Nouvelle méthode pour charger les posts
  loadPosts(): void {
    this.postService.getSubscribedPosts(this.userId).subscribe((posts) => {
      this.posts = posts;
      this.applySorting();
    });
  }
  
  // Nettoyage des abonnements
  ngOnDestroy(): void {
    if (this.toasterSubscription) {
      this.toasterSubscription.unsubscribe();
    }
  }
  
  // Les autres méthodes restent inchangées
  toggleSortMenu(): void {
    this.showSortMenu = !this.showSortMenu;
  }
  
  sortBy(option: string, label: string): void {
    this.currentSortOption = option;
    this.currentSortLabel = label;
    this.showSortMenu = false;
    this.applySorting();
  }
  
  applySorting(): void {
    switch(this.currentSortOption) {
      case 'date':
        this.posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'date-asc':
        this.posts.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'author':
        this.posts.sort((a, b) => a.author.name.localeCompare(b.author.name));
        break;
    }
  }
}
