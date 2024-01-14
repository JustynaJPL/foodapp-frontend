import { Injectable } from '@angular/core';
import axios from 'axios';
import {AxiosResponse} from 'axios';

@Injectable({
  providedIn: 'root'
})
export class LogService {


  private apiloginUrl = 'http://localhost:1337/api/auth/local';


  constructor() {}

  login(email: string, password: string):Promise<AxiosResponse<any>> {
    // w tym miejscu jest próba logowania
    return axios
    .post(this.apiloginUrl, {
      identifier: email,
      password: password,
    });
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  saveUserId(userid: string) {
    localStorage.setItem('userId', userid);
  }
  getUserId():string|null{
    return localStorage.getItem('userId');
  }


}
