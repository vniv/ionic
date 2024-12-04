import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-authentificateur',
  templateUrl: './authentificateur.component.html',
  styleUrls: ['./authentificateur.component.scss'],
  imports: [IonicModule, FormsModule, CommonModule, ReactiveFormsModule],
  standalone: true
})
export class AuthentificateurComponent {

  loginForm: FormGroup; 
  user: any = null; 

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService) {
    
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.user = JSON.parse(savedUser);
      this.router.navigate(['/todo-list']);
    }
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push({ username: 'admin', password: 'admin' });
    localStorage.setItem('users', JSON.stringify(users));
  }

  login() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
  
      this.authService.login(username, password)
        .then(() => {
          console.log('Connexion réussie');
          this.user = JSON.parse(localStorage.getItem('currentUser')!);
          this.router.navigate(['/todo-list']);
        })
        .catch(err => {
          console.error(err.message);
          alert('Nom d’utilisateur ou mot de passe incorrect.');
        });
    } else {
      console.error('Formulaire invalide');
    }
  }

  logout() {
    localStorage.removeItem('currentuser');
    this.user = null;
    console.log('Déconnexion réussie');
  }

}
