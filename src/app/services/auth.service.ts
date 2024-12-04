import { BehaviorSubject } from "rxjs";
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _isAuthenticated = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this._isAuthenticated.asObservable();

  constructor() {}

  login(username: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
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
    });
  }

  logout() {
    localStorage.removeItem('currentUser');
    this._isAuthenticated.next(false);
  }

  isLoggedIn(): boolean {
    return this._isAuthenticated.value;
  }
}