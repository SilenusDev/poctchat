import { Component, OnInit } from '@angular/core';
import { SubjectService } from 'src/app/services/subject.service';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { Subject } from 'src/app/interfaces/subject.interface';
import { User } from 'src/app/interfaces/user.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PostService } from '../../services/posts.service';
import { PostCreate } from '../../interfaces/api/post-create.interface';
import { Router } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  subjects: Subject[] = []; // Liste des sujets récupérés
  currentUser: User | null = null; // Utilisateur connecté
  postForm: FormGroup; // Formulaire de création de post

  constructor(
    private subjectService: SubjectService,
    private authService: AuthService,
    private postService: PostService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private toasterService: ToasterService // Injection du FormBuilder pour la gestion du formulaire réactif
  ) {
    // Initialisation du formulaire réactif
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      author_Id: ['', Validators.required], // Champ caché pour l'ID de l'auteur
      subject: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadSubjects();
    this.loadCurrentUser();
  }

  // Récupère tous les sujets
  loadSubjects(): void {
    this.subjectService.getAllSubjects().subscribe((subjects) => {
      this.subjects = subjects;
    });
  }

  // Récupère l'utilisateur actuel
  loadCurrentUser(): void {
    this.authService.me().subscribe((user) => {
      this.currentUser = user;
      this.postForm.patchValue({ author_Id: user.id }); // Ajoute l'auteur au formulaire
    });
  }

  // Fonction appelée lors de la sélection d'un sujet
  onSubjectChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const subjectId = selectElement.value;
    this.postForm.patchValue({ subject: subjectId });
  }

  // Fonction appelée lors de la soumission du formulaire
  submit(): void {
    if (this.postForm.valid && this.currentUser) {
      // Créer un objet qui correspond à l'interface PostCreate
      const postData: PostCreate = {
        title: this.postForm.value.title,
        content: this.postForm.value.content,
        subject_Id: Number(this.postForm.value.subject),
        author_Id: this.currentUser.id
      };
      
      // Appeler le service pour créer réellement le post
      this.postService.createPost(postData).subscribe({
        next: (response) => {
          // Au lieu d'afficher directement le toast, on l'enregistre pour la page de liste
          this.toasterService.setMessage({
            message: 'Post créé avec succès !',
            type: 'success'
          });
          
          // Redirection vers la page de liste
          this.router.navigate(['/posts']);
        },
        error: (error) => {
          this.snackBar.open('Erreur lors de la création du post: ' + error.message, 'Fermer', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      // Gestion des erreurs de validation
      this.snackBar.open('Veuillez remplir tous les champs requis.', 'Fermer', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }
}

