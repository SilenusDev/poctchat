import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../services/posts.service';
import { CommentsResponse } from 'src/app/features/post/interfaces/api/commentsResponse.interface';
import { CommentCreate } from 'src/app/features/post/interfaces/api/commentCreate.interface';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { User } from 'src/app/interfaces/user.interface';
import { MatSnackBar } from '@angular/material/snack-bar'; // Ajoutez cette importation

@Component({
  selector: 'app-post-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  post: any;
  comments: CommentsResponse[] = [];
  newComment: CommentCreate = {
    post_id: 0,
    author_id: 0,
    content: ''
  };
  currentUser: User | null = null;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private authService: AuthService,
    private snackBar: MatSnackBar // Injectez le service MatSnackBar
  ) {}

  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('id');
  
    if (postId) {
      this.postService.getPostById(+postId).subscribe((data) => {
        this.post = data;
        this.newComment.post_id = +postId;
      });
  
      this.postService.getCommentsByPostId(+postId).subscribe((data) => {
        this.comments = data;
      });
    }
  
    this.authService.me().subscribe(
      (user) => {
        this.currentUser = user;
        this.newComment.author_id = user.id;
      },
      (error) => {
        console.error('Error fetching current user', error);
        this.showToaster('Erreur lors de la récupération de l\'utilisateur', 'error');
      }
    );
  }

  onSubmit(): void {
    // Vérifier si le contenu du commentaire n'est pas vide
    if (!this.newComment.content.trim()) {
      this.showToaster('Le commentaire ne peut pas être vide', 'error');
      return;
    }
  
    this.postService.createComment(this.newComment).subscribe(
      (response) => {
        // Créer un nouvel objet commentaire avec le nom de l'auteur
        const commentWithAuthor = {
          ...response,
          authorName: this.currentUser?.name || 'Utilisateur' // Utiliser le nom de l'utilisateur courant
        };
        
        // Ajouter le nouveau commentaire à la liste
        this.comments.push(commentWithAuthor);
        this.newComment.content = ''; // Vider le textarea
        this.showToaster('Commentaire ajouté avec succès', 'success');
      },
      (error) => {
        console.error('Error creating comment', error);
        this.showToaster('Erreur lors de l\'ajout du commentaire', 'error');
      }
    );
  }

  // Nouvelle méthode pour afficher le toaster
  showToaster(message: string, type: 'success' | 'error' | 'info'): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: [`${type}-snackbar`, 'top-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}