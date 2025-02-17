import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { Tache } from '../models/tache.model';
import { Utilis } from '../models/utilis.model';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  imports: [IonicModule, FormsModule, CommonModule, ReactiveFormsModule],
  styleUrls: ['./todo-list.component.scss'],
  standalone: true,
})
export class TodoListComponent implements OnInit {

  tacheForm: FormGroup;
  constructor (private formBuilder: FormBuilder, private router: Router, private authService: AuthService, private notifService: NotificationService, private databaseService: DatabaseService) {
    this.tacheForm = this.formBuilder.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      deadline: ['', Validators.required],
    });
  }
  taches: Array<any> = [];
  categories = ['Courses', 'Travail', 'Personnel', 'Sport'];
  groupedTasks: { [key: string]: any[] } = {};

  addTask() {
    let tache: Tache;
    if (this.tacheForm.valid) {
      const currentUser = this.authService.getCurrentUser();
      tache = this.tacheForm.value;
      tache.statut = "En cours";
      this.taches.push(tache);

      if(currentUser) {
        
        currentUser.todoList = this.taches;
        this.saveTaches(currentUser);
      }

      this.notifService.requestNotificationPermission();
      this.notifService.testNotification();

      this.notifService.scheduleNotification(tache, this.taches.length - 1);

      this.tacheForm.reset();

    } else {
      console.error('Formulaire invalide');
    }
  }

  groupTasksByCategory() {
    this.groupedTasks = this.taches.reduce((acc, tache) => {
      (acc[tache.category] = acc[tache.category] || []).push(tache);
      return acc;
    }, {});
  }

  deleteTask(index: number) {
    const currentUser = this.authService.getCurrentUser();
    this.taches.splice(index, 1);
    currentUser.todoList = this.taches;
    this.authService.updateCurrentUser(currentUser).subscribe();
  }

  updateStatus(index: number, statut: string) {
    const currentUser = this.authService.getCurrentUser();
    this.taches = this.taches.map((tache, i) =>
      i === index ? { ...tache, statut } : tache
    );
    currentUser.todoList = this.taches;
    this.saveTaches(currentUser);
  }

  saveTaches(currentUser: Utilis) {
    this.authService.updateCurrentUser(currentUser).subscribe();
  }

  loadTaches() {
    const currentUser = this.authService.getCurrentUser();
    return currentUser ? currentUser.todoList : [];
  }

  getTodoById(id: string): Tache | undefined {
    this.taches = this.loadTaches();
    return this.taches.find(tache => tache.id === id);
  }

  async ngOnInit(): Promise<void> {
    this.taches = this.loadTaches();

    this.notifService.requestNotificationPermission();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
