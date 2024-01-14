import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import axios from 'axios';
import {AxiosResponse} from 'axios';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  // private apiUrl = 'https://example.com/api'; // Zmień na swoje API URL

  constructor() {}

  login(email: string, password: string):Promise<AxiosResponse<any>> {
    // Wywołaj endpoint logowania na swoim serwerze

    return axios
    .post('http://localhost:1337/api/auth/local', {
      identifier: email,
      password: password,
    });
  }

  saveToken(token: string): void {
    // Zapisz token w lokalnym składowisku, np. localStorage
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    // Pobierz token z lokalnego składowiska
    return localStorage.getItem('token');
  }

}
