import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  imports: [IonicModule, FormsModule, CommonModule, ReactiveFormsModule],
  styleUrls: ['./todo-list.component.scss'],
  standalone: true,
})
export class TodoListComponent implements OnInit {

  tacheForm: FormGroup;
  constructor (private formBuilder: FormBuilder, private router: Router, private authService: AuthService) {
    this.tacheForm = this.formBuilder.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      deadline: ['', Validators.required],
    });
  }
  taches: Array<any> = [];
  categories = ['Courses', 'Travail', 'Personnel', 'Sport'];

  addTask() {
    if (this.tacheForm.valid) {
      this.taches.push(this.tacheForm.value);
      this.tacheForm.reset();
      this.saveTaches();
    } else {
      console.error('Formulaire invalide');
    }
  }

  deleteTask(index: number) {
    this.taches.splice(index, 1);
  }

  updateStatus(index: number, status: string) {
    this.taches[index].status = status;
  }

  saveTaches() {
    localStorage.setItem('taches', JSON.stringify(this.taches));
  }

  loadCategories() {
    const listTaches = localStorage.getItem('taches');
    if (listTaches) {
      this.taches = JSON.parse(listTaches);
    }
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  openTache( indexTache: number) {
    // TODO faire une page pour l'affichage d'une tache
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }


}
