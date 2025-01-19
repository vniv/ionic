import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonicModule } from '@ionic/angular';
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

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService, private alertController: AlertController) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    if (this.loginForm.valid) {
      const email = this.loginForm.controls["email"].value;
      const password = this.loginForm.controls["password"].value;
      this.authService.login(email, password).subscribe(
        () => {
          this.router.navigateByUrl('/todo-list');
        },
        async (error) => {
          const alert = await this.alertController.create({
            header: 'Error',
            message: error.message || 'An error occurred during login',
            buttons: ['Retour']
          });
          await alert.present();
        }
      );
    }
  }
}
