import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { MeResponse } from 'src/app/interfaces/me-response.interface';
import { User } from 'src/app/interfaces/user.interface';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { UserService } from 'src/app/services/user.service';
import { UserUpdate } from 'src/app/interfaces/userUpdate.interface';
import { MatSnackBar } from '@angular/material/snack-bar'; // Ajoutez cette importation

@Component({
  selector: 'app-me',
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.scss'],
})
export class MeComponent implements OnInit {
  user: MeResponse | null = null;
  unsubscribeForms: { [key: number]: FormGroup } = {};
  userUpdateForm: FormGroup;
  
  constructor(
    private authService: AuthService,
    private subscriptionService: SubscriptionService,
    private userService: UserService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {

    // Définition des regex pour les validations
    const nameRegex = /^[a-zA-Z]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    // C'est ici que nous définissons le formulaire avec ses champs et validations
    this.userUpdateForm = this.fb.group({
      // Champ id - pas de changement
      id: ['', Validators.required],
      
      // Champ name - ajout d'une validation pour n'accepter que des caractères normaux
      name: ['', [
        Validators.required,
        // Cette expression régulière autorise lettres, accents, espaces, apostrophes et tirets
        Validators.pattern(/^[a-zA-ZÀ-ÿ\s'-]+$/)
      ]],
      
      // Champ email - pas de changement
      email: ['', [
        Validators.required, 
        Validators.email
      ]],
      
      // Nouveau champ password avec validation complexe
      password: ['', [
        // Cette expression régulière vérifie que le mot de passe contient:
        // - Au moins une lettre minuscule
        // - Au moins une lettre majuscule
        // - Au moins un chiffre
        // - Au moins un caractère spécial
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/)
      ]]
    });
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.authService.me().subscribe(
      (data: User) => {
        // Convert User to MeResponse structure for component compatibility
        this.user = {
          id: data.id,
          username: data.name,
          email: data.email,
          role: 'CLIENT' as any, // Default role, will be properly set by backend
          createdAt: data.createdAt
        };
        this.initUserUpdateForm();
        this.initForms();
      },
      (error) => {
        console.error('Erreur lors du chargement des données utilisateur:', error);
        this.showToaster('Erreur lors du chargement des données utilisateur', 'error');
      }
    );
  }
  
  initUserUpdateForm(): void {
    if (!this.user) return;
    
    this.userUpdateForm.patchValue({
      id: this.user.id,
      name: this.user.username,
      email: this.user.email
    });
  }

  initForms(): void {
    if (!this.user) return;
    this.unsubscribeForms = {};
    // Subject functionality removed as it's not part of the current UserDTO structure
  }

  onUnsubscribe(subjectId: number): void {
    if (!this.user) {
      this.showToaster('Utilisateur non connecté', 'error');
      return;
    }

    this.subscriptionService.unsubscribeSubject(this.user.id, subjectId).subscribe(
      () => {
        delete this.unsubscribeForms[subjectId];
        this.showToaster('Désabonnement réussi', 'success');
      },
      (error) => {
        console.error('Erreur lors du désabonnement:', error);
        this.showToaster('Erreur lors du désabonnement', 'error');
      }
    );
  }
  
  submit(): void {
    if (this.userUpdateForm.invalid) {
      this.showToaster('Veuillez remplir correctement tous les champs', 'error');
      return;
    }
    
    const userUpdate: UserUpdate = this.userUpdateForm.value;
    
    this.userService.updateUser(userUpdate).subscribe(
      (updatedUser) => {
        console.log('Profil mis à jour avec succès:', updatedUser);
        this.showToaster('Profil mis à jour avec succès', 'success');
        this.loadUserData();
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du profil:', error);
        this.showToaster('Erreur lors de la mise à jour du profil', 'error');
      }
    );
  }

  // Méthode pour afficher le toaster
  showToaster(message: string, type: 'success' | 'error' | 'info'): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: [`${type}-snackbar`, 'center-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}