import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  API_URL = "https://eval-ionic-default-rtdb.europe-west1.firebasedatabase.app/"

  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
    })
  }
  constructor(private http: HttpClient) { }

  getData(path: string): Observable<any> {
    return this.http.get<any>(this.API_URL + path + ".json");
  }

  putData(path: string, body: any): Observable<any> {
    return this.http.put(this.API_URL + path + ".json", body, this.httpOptions);
  }

  postData(path: string, body: any): Observable<any> {
    return this.http.post(this.API_URL + path + ".json", body, this.httpOptions);
  }
}
