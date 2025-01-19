import { BehaviorSubject, Observable } from "rxjs";
import { Injectable } from '@angular/core';
import { DatabaseService } from "./database.service";
import { map, tap } from 'rxjs/operators';
import { Utilis } from "../models/utilis.model";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _isAuthenticated = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this._isAuthenticated.asObservable();

  constructor(private apiService: DatabaseService) {}

  login(username: string, password: string):  Observable<void> {
    /* return new Promise((resolve, reject) => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
  
      const user = users.find(
        (user: any) => user.username === username && user.password === password
      );
  
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this._isAuthenticated.next(true);
        resolve();
      } else {
        reject(new Error('Nom d’utilisateur ou mot de passe incorrect.'));
      }
    });*/ 

    
    return this.apiService.getData(`users/${username}`).pipe(
      map((response: any) => {

        let user: Utilis;
  
        if (response && typeof response === 'object') {

          if (response.email) {
            user = response as Utilis;
          } else {
            const userKey = Object.keys(response)[0];
            user = response[userKey] as Utilis;
          }

        } else {
          throw new Error('Invalid response format');
        }

        const decryptedPassword = this.decryptPassword(user.password);

        if (user && decryptedPassword === password) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this._isAuthenticated.next(true);
        } else {
          throw new Error('Invalid email or password');
        }
      })
    );
  }

  // Décryptage du mdp utilisateur
  decryptPassword(encryptedPassword: string): string {
    return atob(encryptedPassword);
  }

  logout() {
    localStorage.removeItem('currentUser');
    this._isAuthenticated.next(false);
  }

  isLoggedIn(): boolean {
    return this._isAuthenticated.value;
  }

  getCurrentUser(): Utilis {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  updateCurrentUser(user: Utilis): Observable<void> {
    return this.apiService.putData(`users/${user.username}`, JSON.stringify(user)).pipe(
      tap(() => {
        localStorage.setItem('currentUser', JSON.stringify(user));
      })
    );
  }
}