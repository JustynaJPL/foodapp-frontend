import { LogService } from './../log.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import { Router } from '@angular/router';


@Component({
  selector: 'app-log-view',
  standalone: true,
  imports: [CommonModule,
    MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule,
    MatCardModule, MatButtonModule

  ],
  templateUrl: './log-view.component.html',
  styleUrl: './log-view.component.scss',
  providers:[LogService]
})
export class LogViewComponent {
  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });
  isOK: Boolean;

  constructor(private logService: LogService, private router:Router){
    this.isOK = true;

  }

  submit(){
    //tutaj są przenoszone dane z logowania do servisu
    //generuje się też token do danych
    this.logService.login(this.form.get('username')?.value ,this.form.get('password')?.value).then(
      (response) => {
        // Przykładowa obsługa odpowiedzi z serwera
        const token = response.data.jwt;
        this.logService.saveToken(token);
        console.log('Login successful');
        console.log(token);
        this.router.navigate(['/main']);
      },
      (error) => {
        console.error('Login failed', error);
      });
  }





}
